import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Organization, SystemAdmin, AdminOrganizationMessage

class AdminOrganizationChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.admin_id = self.scope['url_route']['kwargs']['admin_id']
        self.organization_id = self.scope['url_route']['kwargs']['organization_id']
        self.room_group_name = f"chat_admin_{self.admin_id}_organization_{self.organization_id}"

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
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        await self.save_message(message)

        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "chat.message",
                "message": message,
                "admin_id": self.admin_id,
                "organization_id": self.organization_id,
            }
        )

    async def chat_message(self, event):
        message = event["message"]
        admin_id = event["admin_id"]
        organization_id = event["organization_id"]

        await self.send(text_data=json.dumps({
            "message": message,
            "admin_id": admin_id,
            "organization_id": organization_id,
        }))

    @database_sync_to_async
    def save_message(self, message):
        admin = SystemAdmin.objects.get(id=self.admin_id)
        organization = Organization.objects.get(id=self.organization_id)
        AdminOrganizationMessage.objects.create(
            admin=admin,
            organization=organization,
            content=message
        )

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Supplier, SystemAdmin, AdminSupplierMessage

class AdminSupplierChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.admin_id = self.scope['url_route']['kwargs']['admin_id']
        self.supplier_id = self.scope['url_route']['kwargs']['supplier_id']
        self.room_group_name = f"chat_admin_{self.admin_id}_supplier_{self.supplier_id}"

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
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        await self.save_message(message)

        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "chat.message",
                "message": message,
                "admin_id": self.admin_id,
                "supplier_id": self.supplier_id,
            }
        )

    async def chat_message(self, event):
        message = event["message"]
        admin_id = event["admin_id"]
        supplier_id = event["supplier_id"]

        await self.send(text_data=json.dumps({
            "message": message,
            "admin_id": admin_id,
            "supplier_id": supplier_id,
        }))

    @database_sync_to_async
    def save_message(self, message):
        admin = SystemAdmin.objects.get(id=self.admin_id)
        supplier = Supplier.objects.get(id=self.supplier_id)
        AdminSupplierMessage.objects.create(
            admin=admin,
            supplier=supplier,
            content=message
        )
