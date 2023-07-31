from django.contrib import admin
# print(path.dirname( path.dirname( path.abspath(__file__) ) ))
# @TODO 이거 왜 안될까..
from .models import SaveImage
from django.utils import timezone

# 어드민 페이지에 등록해서 해당 테이블을 관리할 수 있도록 함.
admin.site.register(SaveImage)

# 여기서 모델을 등록했으니 이제 다른 모델을 가지고 이미지 생성시 해당 테이블에 맞게 저장해주고 blob 타입 활용해서 이진 데이터 형식으로 변환해야함.