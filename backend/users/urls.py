# backend/users/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView

urlpatterns = [
    # POST /api/auth/register/  → register a new user
    path('register/', RegisterView.as_view(), name='register'),
    # POST /api/auth/login/     → obtain JWT pair
    path('login/',    TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # POST /api/auth/token/refresh/
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
