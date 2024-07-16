from django.urls import path, include
from .views import ProfileDetail

urlpatterns = [
    path('<int:pk>/', ProfileDetail.as_view()),
]