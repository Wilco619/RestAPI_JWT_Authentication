from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, AdminUserViewSet, CustomerCountView, CustomerDataViewSet, StaffUserViewSet, CustomerViewSet, UserInfoAPIView, UserLogOutAPIView
from .views import  CreateAdminUserView, CreateCustomerView, CreateStaffUserView, LoginView, VerifyOTPView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'admins-list', AdminUserViewSet)
router.register(r'staffs-list', StaffUserViewSet)
router.register(r'customers-list', CustomerViewSet)


urlpatterns = [

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', UserLogOutAPIView.as_view(), name='logout_user'),
    path('user/', UserInfoAPIView.as_view(), name='user-info'),
    

    path('list/', include(router.urls)),
    path('create-admin/', CreateAdminUserView.as_view(), name='create-admin-user'),
    path('create-staff/', CreateStaffUserView.as_view(), name='create_staff_user'),
    path('create-customer/', CreateCustomerView.as_view(), name='create_customer'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),  # Added endpoint for OTP verification   
    path('customer-data/', CustomerDataViewSet.as_view(), name='customer-data'),
    path('customer-count/', CustomerCountView.as_view(), name='customer-count'),
]
