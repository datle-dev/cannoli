# Generated by Django 5.0.7 on 2024-07-17 22:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cannoli_posts', '0003_alter_like_create_date_alter_post_create_date_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Like',
        ),
    ]