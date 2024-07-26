from rest_framework import serializers
from cannoli_auth.models import User
from cannoli_profiles.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)

    def get_username(self, obj):
        return User.objects.get(pk=obj.user_id.pk).username

    class Meta:
        model = Profile
        fields = ['id', 'user_id', 'username', 'about', 'avatar', 'update_date']
