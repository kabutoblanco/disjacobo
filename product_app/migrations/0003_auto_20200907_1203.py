# Generated by Django 2.2.7 on 2020-09-07 17:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product_app', '0002_auto_20200906_2252'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='product',
            unique_together={('metaproduct', 'is_atomic')},
        ),
    ]