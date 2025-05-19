# // chat/consumers.py

from django.urls import path
from .views import ContactListView, MessageListView

urlpatterns = [
    path('contacts/', ContactListView.as_view(), name='chat-contacts'),
    path('messages/<int:user_id>/', MessageListView.as_view(), name='chat-messages'),
]
