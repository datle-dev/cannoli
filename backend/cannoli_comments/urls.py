from django.urls import path, include
from .views import CommentList, LikeComment, UnlikeComment

urlpatterns = [
    path('', CommentList.as_view()),
    path('likes/', LikeComment.as_view()),
    path('unlikes/', UnlikeComment.as_view()),
]