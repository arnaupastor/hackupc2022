# Generated by Django 4.0.4 on 2022-04-30 00:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hackupc22', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='brand',
            old_name='brand_name',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='brand',
            name='brand_id',
        ),
    ]
