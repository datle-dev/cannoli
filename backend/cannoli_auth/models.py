from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class UserFollowing(models.Model):
    user_id = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)
    following_user_id = models.ForeignKey("User", related_name="followers", on_delete=models.CASCADE)
    create_date = models.DateTimeField(auto_now_add=True)
