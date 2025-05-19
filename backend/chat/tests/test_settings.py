from config.settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mychatdb',
        'USER': 'dbuser',
        'PASSWORD': '12151999',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}