from django.db.models import Exists
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import User, UserFollowing
from .serializers import UserSerializer, UserFollowSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        pk = self.kwargs['pk']
        qs = super().get_queryset()
        qs = qs.annotate(
            followed_by_user=Exists(UserFollowing.objects.filter(
                user_id=pk,
                following_user_id=self.request.user.pk,
            )),
            following_user=Exists(UserFollowing.objects.filter(
                user_id=self.request.user.pk,
                following_user_id=pk,
            )),
        )
        qs = qs.filter(id=pk)
        user = qs.first()
        serializer = UserSerializer(user)
        return Response(serializer.data)

class UsernameDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        username=self.kwargs['username']
        qs = super().get_queryset()
        qs = qs.filter(username=username)
        pk = qs.first().pk
        qs = qs.annotate(
            followed_by_user=Exists(UserFollowing.objects.filter(
                user_id=pk,
                following_user_id=self.request.user.pk,
            )),
            following_user=Exists(UserFollowing.objects.filter(
                user_id=self.request.user.pk,
                following_user_id=pk,
            )),
        )
        user = qs.first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserFollow(generics.CreateAPIView):
    serializer_class = UserFollowSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserUnfollow(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user_following = UserFollowing.objects.get(
            user_id=self.request.data['user_id'],
            following_user_id=self.request.data['following_user_id'],
        )
        if user_following:
            user_following.delete()
            return Response({'message': 'User unfollowed'}, status=status.HTTP_202_ACCEPTED)
        return Response({'message': 'Unfollow unsuccessful'}, status=status.HTTP_404_NOT_FOUND)
