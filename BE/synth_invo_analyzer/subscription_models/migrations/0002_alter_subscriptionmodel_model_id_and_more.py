# Generated by Django 4.2.9 on 2024-06-25 05:37

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('subscription_models', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscriptionmodel',
            name='model_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='subscriptionmodelfeatures',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='subscriptionmodelfeatures',
            name='model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='features', to='subscription_models.subscriptionmodel'),
        ),
    ]
