# app01/views.py

import random
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from rest_framework.views import APIView
from django.db import transaction
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import AnonymousUser
from rest_framework import viewsets, permissions, status
from .models import AdminUser, StaffUser, Customer, CustomUser
from .serializers import AdminUserSerializer, CustomerDataSerializer, OTPSerializer, StaffUserSerializer, CustomerSerializer, CustomUserSerializer, UserLoginSerializer

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
        

class UserLogOutAPIView(GenericAPIView):
    permission_classes=(IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token=request.data["refresh"]
            token= RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserInfoAPIView(RetrieveAPIView):
    permission_classes=(IsAuthenticated,)
    serializer_class=CustomUserSerializer

    def get_object(self):
        return self.request.user



class CreateAdminUserView(APIView):
    permission_classes=(IsAuthenticated,)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        custom_user_data = {
            'email': request.data.get('email'),
            'username': request.data.get('username'),
            'password': request.data.get('password'),
            'user_type': 1,  # Ensure this user is an admin
            'first_name': request.data.get('firstname'),
            'last_name': request.data.get('lastname'),
        }

        admin_user_data = {
            'gender': request.data.get('gender'),
            'address': request.data.get('address'),
            'id_number': request.data.get('id_number'),  # Changed from i_d to id_number
            'phone': request.data.get('phone'),
        }

        try:
            custom_user, created = CustomUser.objects.get_or_create(email=custom_user_data['email'], defaults=custom_user_data)
            if not created:
                # Update user data if it already exists
                for attr, value in custom_user_data.items():
                    setattr(custom_user, attr, value)
                custom_user.save()

            admin_user, created = AdminUser.objects.get_or_create(user=custom_user, defaults=admin_user_data)
            if not created:
                # Update admin profile data if it already exists
                for attr, value in admin_user_data.items():
                    setattr(admin_user, attr, value)
                admin_user.save()

            response_data = {
                'custom_user': CustomUserSerializer(custom_user).data,
                'admin_user': AdminUserSerializer(admin_user).data
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print("Exception:", str(e))
            print("Traceback:", traceback.format_exc())
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class CreateStaffUserView(APIView):
    permission_classes=(IsAuthenticated,)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        custom_user_data = {
            'email': request.data.get('email'),
            'username': request.data.get('username'),
            'password': request.data.get('password'),
            'user_type': 2,  # Ensure this user is a staff member
            'first_name': request.data.get('firstname'),
            'last_name': request.data.get('lastname'),
        }

        staff_user_data = {
            'gender': request.data.get('gender'),
            'address': request.data.get('address'),
            'id_number': request.data.get('id_number'),  # Changed from i_d to id_number
            'phone': request.data.get('phone'),
        }

        try:
            custom_user, created = CustomUser.objects.get_or_create(email=custom_user_data['email'], defaults=custom_user_data)
            if not created:
                for attr, value in custom_user_data.items():
                    setattr(custom_user, attr, value)
                custom_user.save()

            staff_user, created = StaffUser.objects.get_or_create(user=custom_user, defaults=staff_user_data)
            if not created:
                for attr, value in staff_user_data.items():
                    setattr(staff_user, attr, value)
                staff_user.save()

            response_data = {
                'custom_user': CustomUserSerializer(custom_user).data,
                'staff_user': StaffUserSerializer(staff_user).data
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print("Exception:", str(e))
            print("Traceback:", traceback.format_exc())
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CreateCustomerView(APIView):
    permission_classes=(IsAuthenticated,)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        custom_user_data = {
            'email': request.data.get('email'),
            'username': request.data.get('username'),
            'password': request.data.get('password'),
            'user_type': 3,  # Ensure this user is a customer
            'first_name': request.data.get('firstname'),
            'last_name': request.data.get('lastname'),
        }

        customer_data = {
            'gender': request.data.get('gender'),
            'address': request.data.get('address'),
            'id_number': request.data.get('id_number'),  # Changed from i_d to id_number
            'phone': request.data.get('phone'),
        }

        try:
            custom_user, created = CustomUser.objects.get_or_create(email=custom_user_data['email'], defaults=custom_user_data)
            if not created:
                for attr, value in custom_user_data.items():
                    setattr(custom_user, attr, value)
                custom_user.save()

            customer, created = Customer.objects.get_or_create(user=custom_user, defaults=customer_data)
            if not created:
                for attr, value in customer_data.items():
                    setattr(customer, attr, value)
                customer.save()

            response_data = {
                'custom_user': CustomUserSerializer(custom_user).data,
                'customer': CustomerSerializer(customer).data
            }

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

class CustomerViewSet(viewsets.ModelViewSet):
    permission_classes=(IsAuthenticated,)
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
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

class CustomerDataViewSet(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access

    def post(self, request, *args, **kwargs):
        # Check if the user is authenticated
        if isinstance(request.user, AnonymousUser):
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Ensure the user is a StaffUser
        if request.user.user_type != '2':
            return Response({'detail': 'User is not a staff member.'}, status=status.HTTP_403_FORBIDDEN)

        customer_data = {
            'staff': request.user.staffuser.id,  # Link to the current staff user
            'firstname': request.data.get('firstname'),
            'lastname': request.data.get('lastname'),
            'phone': request.data.get('phone'),
            'id_number': request.data.get('id_number'),
            'branch': request.data.get('branch'),
            'gender': request.data.get('gender'),
            'active': request.data.get('active', True)  # Default to True if not provided
        }

        serializer = CustomerDataSerializer(data=customer_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)