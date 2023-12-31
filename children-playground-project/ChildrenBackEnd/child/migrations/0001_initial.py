# Generated by Django 4.2.2 on 2023-07-31 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SaveImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client_id', models.IntegerField()),
                ('save_date', models.DateTimeField(verbose_name='date published')),
                ('image_info', models.BinaryField()),
                ('image_size', models.FloatField()),
            ],
        ),
    ]
