from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField(source='count_likes')
    liked_by_user = serializers.BooleanField(required=False)

    def count_likes(self, obj):
        return obj.liked_by.count()

    def get_like_count(self, obj):
        return obj.liked_by.count()

    class Meta:
        model = Comment
        fields = ['id', 'post_id', 'user_id', 'content', 'like_count', 'liked_by_user', 'create_date']

class LikeSerializer(serializers.Serializer):
    comment_id = serializers.IntegerField()