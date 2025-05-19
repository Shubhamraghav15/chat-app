from django.db import models
from django.contrib.auth.models import User

class Message(models.Model):
  sender   = models.ForeignKey(User, related_name='sent_msgs', on_delete=models.CASCADE)
  receiver = models.ForeignKey(User, related_name='recv_msgs', on_delete=models.CASCADE)
  text     = models.TextField()
  timestamp= models.DateTimeField(auto_now_add=True)

  class Meta:
    ordering = ['-timestamp']
