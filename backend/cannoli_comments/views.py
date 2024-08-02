from django.db.models import Exists, OuterRef
from django.utils import timezone
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from cannoli_auth.models import User
from cannoli_posts.models import Post
from .models import Comment
from .serializers import CommentSerializer, LikeSerializer

class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        post_id = self.request.query_params.get('post_id')
        if user_id is not None:
            qs = qs.filter(user_id=user_id)
        if post_id is not None:
            qs = qs.filter(post_id=post_id)
        return qs.annotate(liked_by_user=Exists(Comment.liked_by.through.objects.filter(
            comment_id=OuterRef('pk'),
            user_id=self.request.user.pk,
        )))

    def perform_create(self, serializer):
        serializer.save(
            user_id=self.request.user,
            create_date=timezone.now(),
        )

class LikeComment(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        qs = Comment.objects.all()
        user_id = self.request.query_params.get('user_id')
        if user_id is not None:
            qs = qs.filter(liked_by=user_id)
            qs = qs.annotate(liked_by_user=Exists(Comment.liked_by.through.objects.filter(
                user_id=self.request.user.pk,
            )))
        serializer = CommentSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            comment = Comment.objects.get(pk=serializer.data['comment_id'])
            user = User.objects.get(pk=request.user.id)
            comment.liked_by.add(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UnlikeComment(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            comment = Comment.objects.get(pk=serializer.data['comment_id'])
            user = User.objects.get(pk=request.user.id)
            comment.liked_by.remove(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
