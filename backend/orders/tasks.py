from celery import shared_task
from django.core.mail import send_mail
from django.core.cache import cache


@shared_task
def send_order_confirmation_email(user_email, order_id):
    send_mail(
        subject=f'Order #{order_id} Confirmed',
        message=f'Your laundry order #{order_id} has been received. We will notify you when picked up.',
        from_email='noreply@laundry.com',
        recipient_list=[user_email],
        fail_silently=False,
    )


@shared_task
def send_order_status_update_email(user_email, order_id, status):
    send_mail(
        subject=f'Order #{order_id} Update',
        message=f'Your order #{order_id} status has been updated to: {status.upper()}.',
        from_email='noreply@laundry.com',
        recipient_list=[user_email],
        fail_silently=False,
    )


@shared_task
def send_driver_assignment_notification(driver_email, order_id):
    send_mail(
        subject=f'New Order Assigned #{order_id}',
        message=f'You have been assigned to Order #{order_id}. Please check your portal.',
        from_email='noreply@laundry.com',
        recipient_list=[driver_email],
        fail_silently=False,
    )


@shared_task
def clear_expired_cache():
    """Periodic task to clear stale cache keys."""
    cache.delete_pattern('orders_list_*')
    cache.delete_pattern('services_list_*')
