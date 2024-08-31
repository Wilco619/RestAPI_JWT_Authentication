# serializers.py
from django.forms import ValidationError
from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import CustomUser, AdminUser, RegionalManager, StaffUser, Customer


class UserLoginSerializer(serializers.ModelSerializer):
    email=serializers.CharField()
    password=serializers.CharField(write_only=True)

    class Meta:
        model=CustomUser
        fields=["email","password"]


    def validate(self, data):
        user=authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class OTPSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    otp = serializers.CharField()

    def validate(self, data):
        user_id = data.get('user_id')
        otp = data.get('otp')

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User not found")

        # Check if OTP is expired
        if user.otp_generated_at and (timezone.now() - user.otp_generated_at) > timedelta(hours=2):
            raise serializers.ValidationError("OTP has expired")

        # Check if OTP is correct
        if user.otp != otp:
            raise serializers.ValidationError("Invalid OTP")

        return data
    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'user_type', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def create(self, validated_data):
        username = validated_data['username']
        if CustomUser.objects.filter(username=username).exists():
            raise ValidationError({"username": "This username is already taken."})

        user = CustomUser.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=validated_data['user_type'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
    
class AdminUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    firstname = serializers.CharField(write_only=True)
    lastname = serializers.CharField(write_only=True)

    class Meta:
        model = AdminUser
        fields = [
            'id',
            'firstname',
            'lastname',
            'email',
            'username',
            'password',
            'gender',
            'address',
            'id_number',  # Changed from i_d to id_number
            'phone',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        firstname = validated_data.pop('firstname')
        lastname = validated_data.pop('lastname')
        email = validated_data.pop('email')
        username = validated_data.pop('username')
        password = validated_data.pop('password')

        user = CustomUser.objects.create_user(
            first_name=firstname,
            last_name=lastname,
            email=email,
            username=username,
            password=password,
            user_type=1,  # AdminUser
        )

        admin_user = AdminUser.objects.create(
            user=user,
            gender=validated_data.get('gender'),
            address=validated_data.get('address'),
            id_number=validated_data.get('id_number'),  # Changed from i_d to id_number
            phone=validated_data.get('phone')
        )

        return admin_user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['firstname'] = instance.user.first_name
        representation['lastname'] = instance.user.last_name
        representation['email'] = instance.user.email
        representation['username'] = instance.user.username
        return representation



class StaffUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    firstname = serializers.CharField(write_only=True)
    lastname = serializers.CharField(write_only=True)

    class Meta:
        model = StaffUser
        fields = [
            'id',
            'firstname',
            'lastname',
            'email',
            'username',
            'password',
            'gender',
            'address',
            'id_number',  # Changed from i_d to id_number
            'phone',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        firstname = validated_data.pop('firstname')
        lastname = validated_data.pop('lastname')
        email = validated_data.pop('email')
        username = validated_data.pop('username')
        password = validated_data.pop('password')

        user = CustomUser.objects.create_user(
            first_name=firstname,
            last_name=lastname,
            email=email,
            username=username,
            password=password,
            user_type=2,  # StaffUser
        )

        staff_user = StaffUser.objects.create(
            user=user,
            gender=validated_data.get('gender'),
            address=validated_data.get('address'),
            id_number=validated_data.get('id_number'),  # Changed from i_d to id_number
            phone=validated_data.get('phone')
        )

        return staff_user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['firstname'] = instance.user.first_name
        representation['lastname'] = instance.user.last_name
        representation['email'] = instance.user.email
        representation['username'] = instance.user.username
        return representation



class RegionalManagerSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    firstname = serializers.CharField(write_only=True)
    lastname = serializers.CharField(write_only=True)

    class Meta:
        model = RegionalManager
        fields = [
            'id',
            'firstname',
            'lastname',
            'email',
            'username',
            'password',
            'gender',
            'address',
            'id_number',  # Changed from i_d to id_number
            'phone',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        firstname = validated_data.pop('firstname')
        lastname = validated_data.pop('lastname')
        email = validated_data.pop('email')
        username = validated_data.pop('username')
        password = validated_data.pop('password')

        user = CustomUser.objects.create_user(
            first_name=firstname,
            last_name=lastname,
            email=email,
            username=username,
            password=password,
            user_type=3,  # Customer
        )

        customer = RegionalManager.objects.create(
            user=user,
            gender=validated_data.get('gender'),
            address=validated_data.get('address'),
            id_number=validated_data.get('id_number'),  # Changed from i_d to id_number
            phone=validated_data.get('phone')
        )

        return customer

    def update(self, instance, validated_data):
        instance.user.first_name = validated_data.get('firstname', instance.user.first_name)
        instance.user.last_name = validated_data.get('lastname', instance.user.last_name)
        instance.user.email = validated_data.get('email', instance.user.email)
        instance.user.username = validated_data.get('username', instance.user.username)
        if 'password' in validated_data:
            instance.user.set_password(validated_data['password'])
        instance.user.save()

        instance.gender = validated_data.get('gender', instance.gender)
        instance.address = validated_data.get('address', instance.address)
        instance.id_number = validated_data.get('id_number', instance.id_number)  # Changed from i_d to id_number
        instance.phone = validated_data.get('phone', instance.phone)
        instance.save()

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['firstname'] = instance.user.first_name
        representation['lastname'] = instance.user.last_name
        representation['email'] = instance.user.email
        representation['username'] = instance.user.username
        return representation


class CustomerSerializer(serializers.ModelSerializer):
    staff_email = serializers.EmailField(source='staff.user.email', read_only=True)
    staff_name = serializers.SerializerMethodField()
    staff_id_number = serializers.CharField(source='staff.id_number', read_only=True)
    staff_phone = serializers.CharField(source='staff.phone', read_only=True)  # Add this line

    class Meta:
        model = Customer
        fields = [
            'id', 'staff', 'staff_email', 'staff_name', 'staff_id_number', 'staff_phone', 'firstname', 'lastname', 'age',
            'gender', 'phone', 'email', 'id_number', 'branch',
            'residence', 'residence_type', 'business_type',
            'business_area', 'next_of_keen', 'guaranter_firstname',
            'guaranter_lastname', 'guaranter_age', 'guaranter_business_type',
            'guaranter_phone', 'guaranter_id', 'guaranter_gender',
            'active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'staff', 'staff_email', 'staff_name', 'staff_id_number', 'staff_phone', 'active']

    def get_staff_name(self, obj):
        return f"{obj.staff.user.first_name} {obj.staff.user.last_name}"

    def create(self, validated_data):
        id_number = validated_data.get('id_number')

        # Check if a customer with the given id_number already exists
        if Customer.objects.filter(id_number=id_number).exists():
            raise serializers.ValidationError("A customer with this ID number already exists.")

        staff = self.context['request'].user.staffuser
        customer = Customer.objects.create(staff=staff, **validated_data)
        return customer

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


