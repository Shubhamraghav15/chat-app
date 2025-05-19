import os
from django.apps import AppConfig
from django.conf import settings


class ChatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat'
    # force Django to use this exact folder
    path = os.path.join(settings.BASE_DIR, 'chat')
