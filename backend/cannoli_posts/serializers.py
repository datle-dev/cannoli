from rest_framework import serializers
from .models import Post, Like

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'user_id', 'content', 'create_date']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model: Like
        fields = ['id', 'user_id', 'post_id', 'create_date']
