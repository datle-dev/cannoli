from django.db.models.signals import post_save
from django.dispatch import receiver
from cannoli_auth.models import User
from cannoli_profiles.models import Profile
import datetime

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile(
            user_id=instance,
            about="",
            avatar="( > u < )",
            update_date=datetime.datetime.now().isoformat()
        )
        profile.save()