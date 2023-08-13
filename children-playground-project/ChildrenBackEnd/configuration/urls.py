from django.contrib import admin
from django.urls import include, path


# 여기는 사용자 정의 path 사용자가 요청할 path를 가지고
# 이후 라우팅 할 곳으로 연결 시켜주는 역할을 함.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('getImage/', include("child.urls")),
    path('regenerate/', include("child.urls")),
    path("manager/", include("child.urls")),
    path("child/", include("child.urls")),
    path("mediapipeTest/", include("child.urls")),
]
