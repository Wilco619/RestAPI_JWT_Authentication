from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import AdminUser, CustomUser, Customer, StaffUser

class UserModelAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type')  # Add fields as per your model
    list_filter = ('user_type',)  # Add filters as per your model

admin.site.register(CustomUser, UserModelAdmin)
admin.site.register(AdminUser)
admin.site.register(StaffUser)
admin.site.register(Customer)

# Register your models here.