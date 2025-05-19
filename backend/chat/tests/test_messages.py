# chat/test/test_messages.py

from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from chat.models import Message

class MessageTests(APITestCase):
    def setUp(self):
        self.sender = User.objects.create_user(username="sender", password="1234")
        self.receiver = User.objects.create_user(username="receiver", password="1234")

    def test_send_message(self):
        self.client.login(username='sender', password='1234')
        self.client.force_authenticate(user=self.sender)

        res = self.client.post(f'/chat/messages/{self.receiver.id}/', {
            "text": "Hello!"
        })

        self.assertEqual(res.status_code, 201)
        self.assertEqual(Message.objects.count(), 1)
