# app01/views.py

import random
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import AdminUser, RegionalManager, StaffUser, Customer, CustomUser
from .serializers import AdminUserSerializer, OTPSerializer, RegionalManagerSerializer, StaffUserSerializer, CustomerSerializer, CustomUserSerializer, UserLoginSerializer

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
            # Use create_user method to ensure password hashing
            custom_user = CustomUser.objects.create_user(
                email=custom_user_data['email'],
                username=custom_user_data['username'],
                password=custom_user_data['password'],
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

class CreateRegionalManagerView(APIView):
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

        regional_manager_data = {
            'gender': request.data.get('gender'),
            'address': request.data.get('address'),
            'id_number': request.data.get('id_number'),  # Changed from i_d to id_number
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
                for attr, value in regional_manager_data.items():
                    setattr(regional_manager, attr, value)
                regional_manager.save()

            response_data = {
                'custom_user': CustomUserSerializer(custom_user).data,
                'customer': RegionalManagerSerializer(regional_manager).data
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