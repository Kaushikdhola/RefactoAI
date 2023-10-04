from django.http import HttpResponse
from rest_framework.views import APIView


class TestAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """sample testing view to connect the server"""

        return HttpResponse("Hello there, we are connected!!")
