from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User

class AuthTests(APITestCase):
    def test_user_registration(self):
        data = {
            "username": "Minni",
            "password": "Delimp@123"
        }
        response = self.client.post('/api/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_token_obtain(self):
        User.objects.create_user(username="testuser", password="testpass123")
        data = {
            "username": "Minni",
            "password": "Delimp@123"
        }
        response = self.client.post('/api/login/', data)
        self.assertIn('access', response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
