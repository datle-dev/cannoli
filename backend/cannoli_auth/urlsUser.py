from django.urls import path, include
from .views import UserDetail, UsernameDetail, UserFollow, UserUnfollow

urlpatterns = [
    path('<int:pk>/', UserDetail.as_view()),
    path('<int:pk>/follow/', UserFollow.as_view()),
    path('<int:pk>/unfollow/', UserUnfollow.as_view()),
    path('<str:username>/', UsernameDetail.as_view()),
]