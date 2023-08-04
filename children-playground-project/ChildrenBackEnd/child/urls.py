from . import views
from django.urls import include, path


# urlpatterns 를 통해서 childPage, managerPage를 구분.
urlpatterns = [
    path("", views.get_image, name="image"),
    path("managePage/", views.manager_page),
    path("childPage/", views.child_page),
    path("childPage/hand_detection/", views.get_hand_detection),
]
