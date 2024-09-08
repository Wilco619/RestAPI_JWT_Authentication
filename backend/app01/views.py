# app01/views.py
import string
import random
import logging
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import AdminUser, RegionalManager, StaffUser, Customer, CustomUser
from .serializers import AdminUserSerializer, OTPSerializer, PasswordChangeSerializer, RegionalManagerSerializer, StaffUserSerializer, CustomerSerializer, CustomUserSerializer, UserLoginSerializer

class LoginView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data

        if user is not None:
            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.otp_generated_at = timezone.now()
            user.save()

            request.session['user_id'] = user.id
            request.session['otp'] = otp

            if settings.SEND_OTP_VIA_EMAIL:
                send_mail(
                    'Your OTP Code',
                    f'Your OTP code is {otp}',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
            else:
                print(f'{user.email} Your OTP code is {otp}')

            return Response({
                'message': 'OTP generated. Check your email.',
                'user_id': user.id,
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    

class VerifyOTPView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = OTPSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user_id = serializer.validated_data.get('user_id')
            user = CustomUser.objects.get(id=user_id)

            # Generate JWT tokens
            token = RefreshToken.for_user(user)

            # Clear OTP fields after successful verification
            user.otp = None
            user.otp_generated_at = None
            user.save()

            return Response({
                'refresh': str(token),
                'access': str(token.access_token),
                'user_type': user.user_type
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class UserLogOutAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class PasswordChangeView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        logger.info(f"Received password change request for user: {request.user.username}")

        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()
            logger.info(f"Password successfully changed for user: {user.username}")
            return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)
        else:
            logger.warning(f"Password change failed for user: {request.user.username}. Errors: {serializer.errors}")
            
            # Prepare a more user-friendly error message
            error_messages = []
            for field, errors in serializer.errors.items():
                for error in errors:
                    error_messages.append(str(error))
            
            return Response({
                "detail": "Password change failed",
                "errors": error_messages,
                "password_requirements": [
                    "Password must be at least 8 characters long",
                    "Password cannot be too similar to your username",
                    "Password must not be a commonly used password",
                    "Password must contain a mix of letters, numbers, and symbols"
                ]
            }, status=status.HTTP_400_BAD_REQUEST)


class UserInfoAPIView(RetrieveAPIView):
    permission_classes=(IsAuthenticated,)
    serializer_class=CustomUserSerializer

    def get_object(self):
        return self.request.user



CustomUser = get_user_model()
logger = logging.getLogger(__name__)

class CreateAdminUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def generate_random_password(self, length=8):
        characters = string.ascii_letters + string.digits  # Letters and digits only
        return ''.join(random.choice(characters) for _ in range(length))

    def send_password_email(self, email, username, password):
        subject = 'Your Admin Account Has Been Created'
        message = f'Hello {username},\n\nYour admin account has been created. Here are your login details:\n\nUsername: {email}\nPassword: {password}\n\nPlease change your password after your first login.\n\nBest regards,\nYour Application Team'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]
        
        try:
            send_mail(subject, message, from_email, recipient_list)
        except Exception as e:
            logger.error(f"Failed to send email to {email}: {str(e)}")

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # Generate a random password if not provided
        password = request.data.get('password') or self.generate_random_password()

        custom_user_data = {
            'email': request.data.get('email'),
            'username': request.data.get('username') or request.data.get('email'),  # Use email as username if not provided
            'password': password,
            'user_type': 1,  # Ensure this user is an admin
            'first_name': request.data.get('firstname'),
            'last_name': request.data.get('lastname'),
        }

        admin_user_data = {
            'gender': request.data.get('gender'),
            'address': request.data.get('address'),
            'id_number': request.data.get('id_number'),
            'phone': request.data.get('phone'),
        }

        try:
            # Validate custom user data
            for field in ['email', 'username']:
                if not custom_user_data[field]:
                    raise ValidationError(f"{field} is required")

            # Check if user already exists
            if CustomUser.objects.filter(email=custom_user_data['email']).exists():
                raise ValidationError("A user with this email already exists")

            # Use create_user method to ensure password hashing
            custom_user = CustomUser.objects.create_user(
                email=custom_user_data['email'],
                username=custom_user_data['username'],
                password=password,  # Use the generated or provided password
                user_type=custom_user_data['user_type'],
                first_name=custom_user_data['first_name'],
                last_name=custom_user_data['last_name']
            )

            admin_user, created = AdminUser.objects.get_or_create(user=custom_user, defaults=admin_user_data)
            if not created:
                # Update admin profile data if it already exists
                for attr, value in admin_user_data.items():
                    setattr(admin_user, attr, value)
                admin_user.save()

            # Send email with login credentials
            self.send_password_email(custom_user.email, custom_user.username, password)

            response_data = {
                'custom_user': CustomUserSerializer(custom_user).data,
                'admin_user': AdminUserSerializer(admin_user).data,
                'message': 'Admin user created successfully. Login credentials have been sent to the provided email.'
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating admin user: {str(e)}", exc_info=True)
            return Response({'detail': 'An error occurred while creating the admin user.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CreateStaffUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def generate_random_password(self, length=8):
        characters = string.ascii_letters + string.digits  # Letters and digits only
        return ''.join(random.choice(characters) for _ in range(length))
    
    def send_password_email(self, email, username, password):
        subject = 'Your Staff Account Has Been Created'
        message = f'Hello {username},\n\nYour staff account has been created. Here are your login details:\n\nUsername: {email}\nPassword: {password}\n\nPlease change your password after your first login.\n\nBest regards,\nYour Application Team'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]
        
        send_mail(subject, message, from_email, recipient_list)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # Generate a random password if not provided
        password = request.data.get('password') or self.generate_random_password()

        custom_user_data = {
            'email': request.data.get('email'),
            'username': request.data.get('username'),
            'password': password,
            'user_type': 2,  # Ensure this user is a staff member
            'first_name': request.data.get('firstname'),
            'last_name': request.data.get('lastname'),
        }

        staff_user_data = {
            'gender': request.data.get('gender'),
            'address': request.data.get('address'),
            'id_number': request.data.get('id_number'),
            'phone': request.data.get('phone'),
        }

        try:
            # Use create_user method to ensure password hashing
            custom_user = CustomUser.objects.create_user(
                email=custom_user_data['email'],
                username=custom_user_data['username'],
                password=custom_user_data['password'],
                user_type=custom_user_data['user_type'],
                first_name=custom_user_data['first_name'],
                last_name=custom_user_data['last_name']
            )

            staff_user, created = StaffUser.objects.get_or_create(user=custom_user, defaults=staff_user_data)
            if not created:
                # Update staff profile data if it already exists
                for attr, value in staff_user_data.items():
                    setattr(staff_user, attr, value)
                staff_user.save()

            # Send email with login credentials if a random password was generated
            if 'password' not in request.data:
                self.send_password_email(custom_user.email, custom_user.username, password)

            response_data = {
                'custom_user': CustomUserSerializer(custom_user).data,
                'staff_user': StaffUserSerializer(staff_user).data,
                'message': 'Staff user created successfully.'
            }

            if 'password' not in request.data:
                response_data['message'] += ' Login credentials have been sent to the provided email.'

            return Response(response_data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print("Exception:", str(e))
            print("Traceback:", traceback.format_exc())
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CreateRegionalManagerView(APIView):
    permission_classes = (IsAuthenticated,)

    def generate_random_password(self, length=8):
        characters = string.ascii_letters + string.digits  # Letters and digits only
        return ''.join(random.choice(characters) for _ in range(length))

    def send_password_email(self, email, username, password):
        subject = 'Your Regional Manager Account Has Been Created'
        message = f'Hello {username},\n\nYour regional manager account has been created. Here are your login details:\n\nUsername: {email}\nPassword: {password}\n\nPlease change your password after your first login.\n\nBest regards,\nYour Application Team'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]
        
        send_mail(subject, message, from_email, recipient_list)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # Generate a random password if not provided
        password = request.data.get('password') or self.generate_random_password()

        custom_user_data = {
            'email': request.data.get('email'),
            'username': request.data.get('username'),
            'password': password,
            'user_type': 3,  # Ensure this user is a regional manager
            'first_name': request.data.get('firstname'),
            'last_name': request.data.get('lastname'),
        }

        regional_manager_data = {
            'gender': request.data.get('gender'),
            'address': request.data.get('address'),
            'id_number': request.data.get('id_number'),
            'phone': request.data.get('phone'),
        }

        try:
            # Use create_user method to ensure password hashing
            custom_user = CustomUser.objects.create_user(
                email=custom_user_data['email'],
                username=custom_user_data['username'],
                password=custom_user_data['password'],
                user_type=custom_user_data['user_type'],
                first_name=custom_user_data['first_name'],
                last_name=custom_user_data['last_name']
            )

            regional_manager, created = RegionalManager.objects.get_or_create(user=custom_user, defaults=regional_manager_data)
            if not created:
                # Update regional manager profile data if it already exists
                for attr, value in regional_manager_data.items():
                    setattr(regional_manager, attr, value)
                regional_manager.save()

            # Send email with login credentials if a random password was generated
            if 'password' not in request.data:
                self.send_password_email(custom_user.email, custom_user.username, password)

            response_data = {
                'custom_user': CustomUserSerializer(custom_user).data,
                'regional_manager': RegionalManagerSerializer(regional_manager).data,
                'message': 'Regional Manager created successfully.'
            }

            if 'password' not in request.data:
                response_data['message'] += ' Login credentials have been sent to the provided email.'

            return Response(response_data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print("Exception:", str(e))
            print("Traceback:", traceback.format_exc())
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes=(IsAuthenticated,)  # Adjust as needed

class AdminUserViewSet(viewsets.ModelViewSet):
    permission_classes=(IsAuthenticated,)
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer
    # permission_classes = [permissions.IsAdminUser]  # Admin-only access

class StaffUserViewSet(viewsets.ModelViewSet):
    permission_classes=(IsAuthenticated,)
    queryset = StaffUser.objects.all()
    serializer_class = StaffUserSerializer
    # permission_classes = [permissions.IsAdminUser]  # Admin-only access

class RmanagerViewSet(viewsets.ModelViewSet):
    permission_classes=(IsAuthenticated,)
    queryset = RegionalManager.objects.all()
    serializer_class = RegionalManagerSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        if user.user_type == 2 or user.user_type == 1:
            return super().create(request, *args, **kwargs)
        return Response({'detail': 'You do not have permission to create customers.'}, status=status.HTTP_403_FORBIDDEN)
    
class CustomerCountView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        print(request.headers)  # Debug: Check if Authorization header is present
        count = Customer.objects.count()
        return Response({'customer_count': count})

class CustomerListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomerSerializer

    def get_queryset(self):
        if self.request.user.user_type == 2:  # Assuming 2 is the StaffUser type
            return Customer.objects.filter(staff=self.request.user.staffuser)
        elif self.request.user.user_type == 1:  # Assuming 1 is the AdminUser type
            return Customer.objects.all()
        return Customer.objects.none()

    def perform_create(self, serializer):
        serializer.save(staff=self.request.user.staffuser)

class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomerSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.user_type == 2:  # StaffUser
            return Customer.objects.filter(staff=self.request.user.staffuser)
        elif self.request.user.user_type == 1:  # AdminUser
            return Customer.objects.all()
        return Customer.objects.none()