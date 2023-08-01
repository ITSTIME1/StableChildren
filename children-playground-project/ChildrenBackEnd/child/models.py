from typing import Any
from django.db import models
from django.utils.timezone import now
'''
로컬 디비를 사용하지 말고 외부 디비를 사용해서 보여주자 왜냐하면 로컬 디비에 저장하는 것도 저장하는 순간 새로고침 되기 때문에
이거 아마 장고 프로젝트가 전체가 연결되어 있어서 그런 것 같다.
'''

'''
# hi
@save_date = 이미지가 저장되는 시간
@image_info = 이미지를 바이너리로 처리.
@image_size = 이미지 사이즈를 저장.
'''
class SaveImage(models.Model):
    # id 는 autoincrement
    # model_name 은 문자길이가 30을 넘지 않게 최대 255
    
    model_name = models.CharField(max_length=50, default='some_value')
    # BLOB 타입
    image_info = models.BinaryField()
    image_date = models.DateTimeField(default=now)
    # image_time = models.TimeField(default=timezone.now)
    image_size = models.FloatField()
    
    # SaveImage object 형식으로 나오기 때문에
    # 스트링으로 변환해서 보여주는 함수가 필요. 따라서 정의.
    def __str__(self):
        return f'{self.model_name}, {self.image_info}, {self.image_size}'

        
        
    