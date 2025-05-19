# config/asgi.py
print(">>> LOADING ASGI", __file__)
# config/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from chat.jwt_middleware import JwtAuthMiddleware
import chat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': JwtAuthMiddleware(
        URLRouter(chat.routing.websocket_urlpatterns)
    ),
})

# WebSocket connection to 'ws://localhost:8000/ws/chat/4/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3NTYyNDg5LCJpYXQiOjE3NDc1NjIxODksImp0aSI6ImNiZjEzM2NkNDcwZTQ0OGJhNzUxNGIyYWNjOWExZDQ0IiwidXNlcl9pZCI6NH0.YneXGnQodjUU7WgrGnDhRKBX-NRjh758drxc8M6KiTI' failed: WebSocket is closed before the connection is established.


# const ws = new WebSocket('ws://localhost:8000/ws/chat/4/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3NTYyNDg5LCJpYXQiOjE3NDc1NjIxODksImp0aSI6ImNiZjEzM2NkNDcwZTQ0OGJhNzUxNGIyYWNjOWExZDQ0IiwidXNlcl9pZCI6NH0.YneXGnQodjUU7WgrGnDhRKBX-NRjh758drxc8M6KiTI');



