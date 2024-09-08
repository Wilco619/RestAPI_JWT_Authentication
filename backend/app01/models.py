from django.db import models
from .choices import BUSINESS_CHOICES, GENDER_CHOICES, BRANCH_CHOICES, RESIDENCE_CHOICES
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', 1)  # Assuming 1 is the AdminUser

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = [
        (1, "AdminUser"),
        (2, "StaffUser"),
        (3, "RegionalManager"),
    ]

    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    user_type = models.IntegerField(default=1, choices=USER_TYPE_CHOICES)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_generated_at = models.DateTimeField(null=True, blank=True)

    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()  # Custom manager for handling user creation

    def __str__(self):
        return self.email

class AdminUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=10)
    address = models.TextField()
    id_number = models.CharField(max_length=8)
    phone = models.CharField(max_length=12)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Admin: {self.user.email}"

class StaffUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=10)
    address = models.TextField()
    id_number = models.CharField(max_length=8)
    phone = models.CharField(max_length=12)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Staff: {self.user.email}"

class RegionalManager(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=10)
    address = models.TextField()
    id_number = models.CharField(max_length=8)
    phone = models.CharField(max_length=12)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Customer: {self.user.email}"

class Customer(models.Model):
    staff = models.ForeignKey(StaffUser, on_delete=models.CASCADE, related_name='created_customers')
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    age = models.CharField(max_length=2)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=10)
    phone = models.CharField(max_length=12)
    email = models.EmailField(unique=True, blank=True)
    id_number = models.CharField(max_length=8, unique=True)
    branch = models.CharField(choices=BRANCH_CHOICES, max_length=20)
    residence = models.CharField(max_length=50)
    residence_type = models.CharField(choices=RESIDENCE_CHOICES, max_length=20)
    business_type = models.CharField(choices=BUSINESS_CHOICES, max_length=20)
    business_area = models.CharField(max_length=50)
    next_of_keen = models.CharField(max_length=50)
    next_of_keen_contact = models.CharField(max_length=50)
    guaranter_firstname = models.CharField(max_length=50)
    guaranter_lastname = models.CharField(max_length=50)
    guaranter_age = models.CharField(max_length=2)
    guaranter_business_type = models.CharField(max_length=50)
    guaranter_phone = models.CharField(max_length=50)
    guaranter_id = models.CharField(max_length=50)
    guaranter_gender = models.CharField(choices=GENDER_CHOICES, max_length=10)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"


@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.user_type == 1:
            AdminUser.objects.create(user=instance)
        elif instance.user_type == 2:
            StaffUser.objects.create(user=instance)
        elif instance.user_type == 3:
            RegionalManager.objects.create(user=instance)

@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    if instance.user_type == 1 and hasattr(instance, 'adminuser'):
        instance.adminuser.save()
    elif instance.user_type == 2 and hasattr(instance, 'staffuser'):
        instance.staffuser.save()
    elif instance.user_type == 3 and hasattr(instance, 'regionalmanager'):
        instance.regionalmanager.save()
