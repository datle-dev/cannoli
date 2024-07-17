from django.urls import path, include
from .views import PostList, PostLike

urlpatterns = [
    path('', PostList.as_view()),
    path('likes/', PostLike.as_view()),
]