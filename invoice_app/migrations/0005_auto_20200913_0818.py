# Generated by Django 2.2.7 on 2020-09-13 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice_app', '0004_auto_20200912_1418'),
    ]

    operations = [
        migrations.AddField(
            model_name='detail',
            name='is_consumption',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='detail',
            name='util',
            field=models.FloatField(default=0.0),
        ),
    ]
