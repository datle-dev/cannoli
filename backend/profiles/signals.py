from django.db.models.signals import post_save
from django.dispatch import receiver
from authentication.models import User
from profiles.models import Profile
import datetime

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile(
            user_id=instance,
            about="",
            update_date=datetime.datetime.now().isoformat()
        )
        profile.save()