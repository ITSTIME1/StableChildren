from . import views
from django.urls import include, path

urlpatterns = [
    path("", views.get_image, name="image"),
]
