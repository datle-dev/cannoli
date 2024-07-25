from rest_framework import serializers
from .models import User, UserFollowing

class UserSerializer(serializers.ModelSerializer):
    follower_count = serializers.SerializerMethodField(read_only=True)
    following_user = serializers.BooleanField(read_only=True)
    followed_by_user = serializers.BooleanField(read_only=True)

    def get_follower_count(self, obj):
        return UserFollowing.objects.filter(following_user_id=obj).count()

    class Meta:
        model = User
        fields = ['id', 'username', 'date_joined', 'follower_count', 'followed_by_user', 'following_user']

class UserFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollowing
        fields = ['id', 'user_id', 'following_user_id', 'create_date']
