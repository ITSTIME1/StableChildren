from . import views
from django.urls import include, path

urlpatterns = [
    path("s", views.index, name="index"),
    path("", views.get_image, name="image"),
]
