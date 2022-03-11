# Generated by Django 2.2.6 on 2022-03-10 17:56

from django.db import migrations


def reset_withdrawreason_data(apps, schema_editor):
    WithdrawReason = apps.get_model('good_purchase', 'WithdrawReason')
    WithdrawReason.objects.all().delete()
    bulk_create_list = list()
    reason_list = ['损坏', '毕业', '更换']
    for reason in reason_list:
        obj = WithdrawReason(reason_type=reason)
        bulk_create_list.append(obj)
    WithdrawReason.objects.bulk_create(bulk_create_list)


class Migration(migrations.Migration):

    dependencies = [
        ('good_purchase', '0007_auto_20220125_2146'),
    ]

    operations = [
        migrations.RunPython(reset_withdrawreason_data),
    ]
