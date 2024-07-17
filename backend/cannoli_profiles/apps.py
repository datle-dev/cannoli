from django.apps import AppConfig


class CannoliProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cannoli_profiles'

    def ready(self):
        import cannoli_profiles.signals