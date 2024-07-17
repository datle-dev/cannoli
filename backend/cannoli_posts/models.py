from django.db import models

class Post(models.Model):
    user_id = models.ForeignKey('cannoli_auth.User', blank=True, on_delete=models.CASCADE)
    content = models.TextField(max_length=256, default="")
    create_date = models.DateTimeField(blank=True)

class Like(models.Model):
    user_id = models.ForeignKey('cannoli_auth.User', blank=True, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    create_date = models.DateTimeField(blank=True)
