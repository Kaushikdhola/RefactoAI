from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import json

class Fetch_Code(APIView):
    def get(self, request, *args, **kwargs):
        code_url = "https://github.com/login/oauth/authorize"
        params = {"client_id": request.GET.get("client_id") }
        try:
            response = requests.get(code_url,params=params)
            if response.status_code == 200:
                if 'text/html' in response.headers.get('content-type', '').lower():
                    print("response is text/html")
                    html_content = response.text
                    return Response({'html_content': html_content})
                try:
                    data = response.json()
                    return Response(data)
                except json.JSONDecodeError:
                    return Response({'error':'Ivalid JSON response fromt the API'},status=500)
                print("done")
                print(data)
                return HttpResponse("API call was successful")
            else:
                return HttpResponse(f"API call failed with status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            return HttpResponse(f"API call failed with error: {str(e)}")

class Fetch_Access(APIView):
    def post(self,request, *args, **kwargs):
        access_url = "https://github.com/login/oauth/access_token"
        params = request.data
        try:
            response = requests.post(access_url,params=params)
            resp_data = {}
            for pair in (response.text.split('&')):
                key,value = pair.split('=')
                resp_data[key] = value
            print(resp_data)

        except request.exceptions.RequestException as e:
            return HttpResponse(f"API call failed with error: {str(e)}")
            
        resp_data["message"] = "Data received successfully"
        return Response(resp_data, status=response.status_code)
        

