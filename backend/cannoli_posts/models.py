from django.db import models
from cannoli_auth.models import User

class Post(models.Model):
    user_id = models.ForeignKey(User, blank=True, on_delete=models.CASCADE)
    content = models.TextField(max_length=256, default="")
    create_date = models.DateTimeField(blank=True)
    liked_by = models.ManyToManyField(User, related_name="likes")