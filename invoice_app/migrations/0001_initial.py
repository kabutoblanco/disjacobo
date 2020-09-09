# Generated by Django 2.2.7 on 2020-09-09 06:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('product_app', '0002_auto_20200909_0136'),
    ]

    operations = [
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.IntegerField(choices=[(1, 'CONTADO'), (2, 'CREDITO')], default=1)),
                ('reteiva', models.FloatField(default=0.0)),
                ('reteica', models.FloatField(default=0.0)),
                ('retefuente', models.FloatField(default=0.0)),
                ('home_delivery', models.FloatField(default=0.0)),
                ('total', models.FloatField(default=0.0)),
                ('is_active', models.BooleanField(default=True)),
                ('date_record', models.DateTimeField()),
                ('date_update', models.DateTimeField()),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ref', models.CharField(max_length=32, unique=True)),
                ('mode', models.IntegerField(choices=[(1, 'LOCAL'), (2, 'DOMICILIO')], default=1)),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='invoice_app.Invoice')),
            ],
            options={
                'verbose_name': 'Venta',
                'verbose_name_plural': 'Ventas',
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ref', models.CharField(max_length=32, unique=True)),
                ('type', models.IntegerField(choices=[(1, 'CASH'), (2, 'CREDIT_CARD'), (3, 'DEBIT_CARD'), (4, 'PSE'), (6, 'DEPOSIT'), (7, 'TRANSFER')], default=1)),
                ('total', models.FloatField(default=0.0)),
                ('is_active', models.BooleanField(default=True)),
                ('date_record', models.DateTimeField()),
                ('date_update', models.DateTimeField()),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='invoice_app.Invoice')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Pago',
                'verbose_name_plural': 'Pagos',
            },
        ),
        migrations.CreateModel(
            name='Detail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.FloatField(default=0.0)),
                ('ico', models.FloatField(default=0.0)),
                ('iva', models.FloatField(default=0.0)),
                ('discount', models.FloatField(default=0.0)),
                ('total', models.FloatField(default=0.0)),
                ('is_promo', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('date_record', models.DateTimeField()),
                ('date_update', models.DateTimeField()),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='invoice_app.Invoice')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product_app.Product')),
            ],
            options={
                'verbose_name': 'Detalle',
                'verbose_name_plural': 'Detalles',
            },
        ),
        migrations.CreateModel(
            name='Buy',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ref', models.CharField(max_length=32, unique=True)),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='invoice_app.Invoice')),
            ],
            options={
                'verbose_name': 'Compra',
                'verbose_name_plural': 'Compras',
            },
        ),
    ]
