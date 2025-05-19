# backend/config/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/chat/', include('chat.urls')),   # include your chat app’s HTTP API
    path('api/auth/', include('users.urls')),  # if you have a users/urls.py for register/login
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair_alias'),
]
