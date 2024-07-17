from django.db.models import Count
from django.shortcuts import render
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Post, Like
from .serializers import PostSerializer, LikeSerializer

class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.annotate(likes=Count('like'))

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user, create_date=timezone.now())

class PostLike(generics.CreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user, create_date=timezone.now())