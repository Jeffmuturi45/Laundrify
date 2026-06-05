from rest_framework_simplejwt.tokens import RefreshToken


def get_tokens_for_user(user_id, email, role='customer'):
    """Generate JWT tokens with custom claims."""
    from rest_framework_simplejwt.tokens import RefreshToken
    import datetime

    class CustomRefreshToken(RefreshToken):
        pass

    refresh = CustomRefreshToken()
    refresh['user_id'] = user_id
    refresh['email'] = email
    refresh['role'] = role

    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }


def get_tokens_for_driver(driver_id, email):
    return get_tokens_for_user(driver_id, email, role='driver')
