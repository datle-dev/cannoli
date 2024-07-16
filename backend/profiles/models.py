from django.db import models

class Profile(models.Model):
    user = models.OneToOneField('authentication.User', null=True, on_delete=models.SET_NULL)
    about = models.TextField(max_length=256)
    update_date = models.DateTimeField()