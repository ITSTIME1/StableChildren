from django.shortcuts import render
from django.http import HttpResponse 

# Create your views here.
# views 처리해야될 구조는 우선

def index(request):
    return HttpResponse("Hello, World")

def get_image(request):
    print(request)
    return HttpResponse("Test Success")