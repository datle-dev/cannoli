from rest_framework import serializers
from cannoli_profiles.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user_id', 'about', 'avatar', 'update_date']
