from . import views
from django.urls import include, path


# urlpatterns 를 통해서 childPage, managerPage를 구분.
urlpatterns = [
    path("", views.get_image, name="image"),
    path("managePage/", views.manager_page, name="manager"),
    path("childPage/", views.child_page, name="childPage"),
    path("childPage/hand_detection_page/", views.hand_detection_page, name="handPage"),
]
