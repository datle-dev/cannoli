from rest_framework import serializers
from .models import Post
from cannoli_profiles.models import Profile

class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField(source='count_likes')
    liked_by_user = serializers.BooleanField(required=False)
    username = serializers.CharField(source='user_id.username', read_only=True)
    avatar = serializers.SerializerMethodField()

    def count_likes(self, obj):
        return obj.liked_by.count()

    def get_like_count(self, obj):
        return obj.liked_by.count()

    def get_avatar(self, obj):
        return Profile.objects.filter(user_id=obj.user_id).first().avatar

    class Meta:
        model = Post
        fields = ['id', 'user_id', 'username', 'avatar', 'content', 'like_count', 'liked_by_user', 'create_date']

class LikeSerializer(serializers.Serializer):
    post_id = serializers.IntegerField()