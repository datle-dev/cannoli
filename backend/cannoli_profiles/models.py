from django.db import models

class Profile(models.Model):
    user_id = models.OneToOneField('cannoli_auth.User', on_delete=models.CASCADE)
    about = models.TextField(max_length=256, default="")
    avatar = models.CharField(max_length=9, default="( > u < )")
    update_date = models.DateTimeField()