from . import views
from django.urls import include, path


# urlpatterns 를 통해서 childPage, managerPage를 구분.
urlpatterns = [
    path("generateImage/", views.get_image, name="image"),
    path("regenerateImage/", views.get_regenerate_image, name="regenerateImage"),
    path("managePage/", views.manager_page, name="manager"),
    path("childPage/", views.child_page, name="childPage"),
    path("childPage/hand_detection_page/", views.hand_detection_page, name="handPage"),
    path("childPage/hand_detection_page/model_choice_page/", views.model_choice_page, name="modelChoicePage"),
    path("childPage/hand_detection_page/model_choice_page/loading_page/", views.loading_page, name="loadingPage"),
]
