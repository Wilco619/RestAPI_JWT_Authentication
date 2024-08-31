from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, AdminUserViewSet, CustomerCountView, CustomerDetailView, CustomerListView, RmanagerViewSet, StaffUserViewSet, UserInfoAPIView, UserLogOutAPIView
from .views import  CreateAdminUserView, CreateRegionalManagerView, CreateStaffUserView, LoginView, VerifyOTPView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'admins-list', AdminUserViewSet)
router.register(r'staffs-list', StaffUserViewSet)
router.register(r'rmanagers-list', RmanagerViewSet)


urlpatterns = [

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', UserLogOutAPIView.as_view(), name='logout_user'),
    path('user/', UserInfoAPIView.as_view(), name='user-info'),
    
    path('list/', include(router.urls)),
    path('create-admin/', CreateAdminUserView.as_view(), name='create-admin-user'),
    path('create-staff/', CreateStaffUserView.as_view(), name='create_staff_user'),
    path('create-regional-manager/', CreateRegionalManagerView.as_view(), name='create_regional_manager'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),  # Added endpoint for OTP verification   

    path('customers/', CustomerListView.as_view(), name='customer-list'),
    path('customers/<int:pk>/', CustomerDetailView.as_view(), name='customer-detail'),
    path('customer-count/', CustomerCountView.as_view(), name='customer-count'),
]
