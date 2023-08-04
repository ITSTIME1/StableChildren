"""
URL configuration for ChildrenBackEnd project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path


# 여기는 사용자 정의 path 사용자가 요청할 path를 가지고
# 이후 라우팅 할 곳으로 연결 시켜주는 역할을 함.
urlpatterns = [
    path('getImage/', include("child.urls")),
    path('admin/', admin.site.urls),
    path("manager/", include("child.urls")),
    path("child/", include("child.urls")),
]
