from rest_framework import serializers
from .models import User, UserFollowing
from cannoli_profiles.models import Profile

class UserSerializer(serializers.ModelSerializer):
    follower_count = serializers.SerializerMethodField(read_only=True)
    following_user = serializers.BooleanField(read_only=True)
    followed_by_user = serializers.BooleanField(read_only=True)
    profile_id = serializers.SerializerMethodField(read_only=True)

    def get_follower_count(self, obj):
        return UserFollowing.objects.filter(following_user_id=obj).count()

    def get_profile_id(self, obj):
        user_id = obj.id
        profile_id = Profile.objects.get(id=user_id).id
        return profile_id

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_id', 'date_joined', 'follower_count', 'followed_by_user', 'following_user']

class UserFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollowing
        fields = ['id', 'user_id', 'following_user_id', 'create_date']
