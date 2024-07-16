from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from profiles.models import Profile
from profiles.serializers import ProfileSerializer

class ProfileDetail(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        pk = self.kwargs['pk']
        profile = Profile.objects.get(user_id=pk)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

