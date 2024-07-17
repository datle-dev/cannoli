from django.urls import path, include
from cannoli_profiles.views import ProfileDetail

urlpatterns = [
    path('<int:pk>/', ProfileDetail.as_view()),
]