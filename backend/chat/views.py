from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .models import Message
from .serializers import UserSerializer, MessageSerializer
from django.db.models import Q

class ContactListView(generics.ListAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = [permissions.IsAuthenticated]

class MessageListView(generics.ListAPIView):
  serializer_class = MessageSerializer
  permission_classes = [permissions.IsAuthenticated]
  def get_queryset(self):
    other_id = self.kwargs['user_id']
    me = self.request.user.id
    return Message.objects.filter(
      (Q(sender_id=me)&Q(receiver_id=other_id)) |
      (Q(sender_id=other_id)&Q(receiver_id=me))
    )[:50]
