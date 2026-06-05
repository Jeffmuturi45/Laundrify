from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Notification
from drivers.models import DriverNotification


def notify_user(user, title, message):
    """Save to DB + push via WebSocket."""
    Notification.objects.create(user=user, title=title, message=message)

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notifications_{user.id}',
        {
            'type':    'send_notification',
            'title':   title,
            'message': message,
        }
    )


def notify_driver(driver, title, message):
    """Save to DB + push via WebSocket."""
    DriverNotification.objects.create(
        driver=driver, title=title, message=message)

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notifications_{driver.id}',
        {
            'type':    'send_notification',
            'title':   title,
            'message': message,
        }
    )
