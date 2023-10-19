from django.http import QueryDict
from rest_framework.views import APIView

from core.utils.exceptions import ValidationError


class BaseView(APIView):
    """
    Base View for all the API's.
    Consists of some common utils based on request
    """

    def parse_payload(self, request):
        """prepares payload from request"""
        return (
            request.data.dict() if isinstance(request.data, QueryDict) else request.data
        )

    def validate_instance(self, instance):
        """checks if the instance is valid and if not then raise validation error"""
        if not instance:
            raise ValidationError("Invalid Instance!!")
