from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async

class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # ✅ IMPORTS INSIDE FUNCTION ONLY!
        from django.contrib.auth.models import AnonymousUser
        from rest_framework_simplejwt.authentication import JWTAuthentication
        from rest_framework_simplejwt.tokens import UntypedToken
        from rest_framework_simplejwt.exceptions import InvalidToken

        scope['user'] = AnonymousUser()

        query_string = scope.get('query_string', b'').decode()
        token = parse_qs(query_string).get('token', [None])[0]

        if token:
            try:
                UntypedToken(token)
                auth = JWTAuthentication()
                validated_token = auth.get_validated_token(token)
                user = await database_sync_to_async(auth.get_user)(validated_token)
                scope['user'] = user
            except InvalidToken:
                pass

        return await super().__call__(scope, receive, send)
