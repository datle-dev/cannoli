from django.db.models import Exists, OuterRef
from django.utils import timezone
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from cannoli_auth.models import User
from .models import Post
from .serializers import PostSerializer, LikeSerializer

class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        if user_id is not None:
            qs = qs.filter(user_id=user_id)
        return qs.annotate(liked_by_user=Exists(Post.liked_by.through.objects.filter(
            post_id=OuterRef('pk'),
            user_id=self.request.user.pk,
        )))

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user, create_date=timezone.now())

class LikePost(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        qs = Post.objects.all()
        user_id = self.request.query_params.get('user_id')
        if user_id is not None:
            qs = qs.filter(liked_by=user_id)
            qs = qs.annotate(liked_by_user=Exists(Post.liked_by.through.objects.filter(
                user_id=self.request.user.pk,
            )))
        serializer = PostSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            post = Post.objects.get(pk=serializer.data['post_id'])
            user = User.objects.get(pk=request.user.id)
            post.liked_by.add(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UnlikePost(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            post = Post.objects.get(pk=serializer.data['post_id'])
            user = User.objects.get(pk=request.user.id)
            post.liked_by.remove(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostDetail(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        post_id = self.kwargs['pk']
        qs = self.get_queryset()
        qs = qs.annotate(liked_by_user=Exists(Post.liked_by.through.objects.filter(
            post_id=OuterRef('pk'),
            user_id=self.request.user.pk,
        )))
        qs = qs.filter(id=post_id)
        post = qs.first()
        serializer = PostSerializer(post)
        return Response(serializer.data)