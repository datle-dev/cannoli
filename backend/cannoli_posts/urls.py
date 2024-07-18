from django.urls import path, include
from .views import PostList, LikePost, UnlikePost

urlpatterns = [
    path('', PostList.as_view()),
    path('likes/', LikePost.as_view()),
    path('unlikes/', UnlikePost.as_view()),
]