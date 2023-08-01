# Generated by Django 4.2.3 on 2023-08-01 06:08

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('child', '0004_delete_choice_delete_question'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='saveimage',
            name='save_date',
        ),
        migrations.AddField(
            model_name='saveimage',
            name='image_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='saveimage',
            name='model_name',
            field=models.CharField(default='some_value', max_length=50),
        ),
    ]
