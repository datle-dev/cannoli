# Generated by Django 5.0.7 on 2024-07-24 14:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cannoli_comments', '0001_initial'),
        ('cannoli_posts', '0005_post_liked_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='post_id',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='cannoli_posts.post'),
        ),
    ]
