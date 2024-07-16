from django.urls import path, include
from rest_framework_simplejwt.views import TokenBlacklistView

urlpatterns = [
    path('', include('dj_rest_auth.urls')),
    path('registration/', include('dj_rest_auth.registration.urls')),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
]