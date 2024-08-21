from django.urls import path, include
from .views import UserDetail, UsernameDetail, UserFollow, UserUnfollow, UserFollowingUser, UserFollowersUser

urlpatterns = [
    path('<int:pk>/', UserDetail.as_view()),
    path('<int:pk>/follow/', UserFollow.as_view()),
    path('<int:pk>/unfollow/', UserUnfollow.as_view()),
    path('<str:username>/', UsernameDetail.as_view()),
    path('<int:pk>/followers/', UserFollowingUser.as_view()),
    path('<int:pk>/following/', UserFollowersUser.as_view()),
]