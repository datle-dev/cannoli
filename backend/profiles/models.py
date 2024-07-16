from django.db import models

class Profile(models.Model):
    user_id = models.OneToOneField('authentication.User', on_delete=models.CASCADE)
    about = models.TextField(max_length=256)
    update_date = models.DateTimeField()