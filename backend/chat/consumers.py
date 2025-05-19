import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        from channels.exceptions import DenyConnection

        if self.scope["user"].is_anonymous:
            raise DenyConnection()

        me = self.scope['user'].id
        other = int(self.scope['url_route']['kwargs']['other_user_id'])
        self.room_name = f'chat_{min(me, other)}_{max(me, other)}'

        await self.channel_layer.group_add(self.room_name, self.channel_name)
        print(f">>> WebSocket connected: {self.scope['user'].username}")
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     text = data['text']
    #     sender = self.scope['user']
    #     receiver_id = data['to']

    #     # ✅ IMPORTS MOVED INSIDE FUNCTION
    #     from .models import Message
    #     from django.contrib.auth.models import User

    #     receiver = await database_sync_to_async(User.objects.get)(id=receiver_id)
    #     msg = Message(sender=sender, receiver=receiver, text=text)
    #     await database_sync_to_async(msg.save)()

    #     payload = {
    #         'text': text,
    #         'sender': sender.username,
    #         'timestamp': msg.timestamp.isoformat()
    #     }
    #     await self.channel_layer.group_send(
    #         self.room_name,
    #         {
    #             'type': 'chat.message',
    #             'message': payload,
    #             'sender_channel': self.channel_name  # ✅ add sender info
    #         }
    #     )


    # async def chat_message(self, event):
    #     if event.get('sender_channel') == self.channel_name:
    #         return  # ❌ don't send back to sender
    #     await self.send(text_data=json.dumps(event['message']))
    #     print(f">>> Message broadcasted: {event['message']}")
    async def receive(self, text_data):
        data = json.loads(text_data)
        text = data['text']
        sender = self.scope['user']
        receiver_id = data['to']

        from .models import Message
        from django.contrib.auth.models import User

        receiver = await database_sync_to_async(User.objects.get)(id=receiver_id)
        msg = Message(sender=sender, receiver=receiver, text=text)
        await database_sync_to_async(msg.save)()

        payload = {
            'id': msg.id,
            'text': text,
            'sender_id': sender.id,
            'timestamp': msg.timestamp.isoformat()
        }

        # await self.channel_layer.group_send(
        #     self.room_name,
        #     {
        #         'type': 'chat.message',
        #         'message': payload,
        #         'sender_channel_name': self.channel_name  # 💥 Add sender channel
        #     }
        # )
        await self.channel_layer.group_send(
            f"user_{receiver.id}_notifications",
            {
                "type": "notify",
                "message": {
                    "from_user_id": sender.id,
                    "text": text,
                    "timestamp": msg.timestamp.isoformat(),
                }
            }
        )

    async def chat_message(self, event):
        if self.channel_name == event.get('sender_channel_name'):
            # 💥 Do not send the message back to sender
            return
        await self.send(text_data=json.dumps(event['message']))

# NEW: NotificationConsumer
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
            return

        self.user = self.scope["user"]
        self.group_name = f"user_{self.user.id}_notifications"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def notify(self, event):
        await self.send(text_data=json.dumps(event["message"]))

