# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.exceptions import PermissionDenied
from authentication.permissions import IsOrganization, IsSystemAdmin
from authentication.utils import decode_token

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        token = dict(self.scope['headers'])[b'authorization'].decode()
        user_info = decode_token(token)
        self.user_id = user_info['user_id']
        self.role = user_info['role']

        # Check permissions
        if self.role not in ['organization', 'system_admin']:
            await self.close(code=403)
            return

        self.room_group_name = 'chat_group'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_id': self.user_id,
                'role': self.role
            }
        )

    async def chat_message(self, event):
        message = event['message']
        user_id = event['user_id']
        role = event['role']

        await self.send(text_data=json.dumps({
            'message': message,
            'user_id': user_id,
            'role': role
        }))
