from typing import Any
from django.db import models


'''
sqlite3 에서 blob 타입을 사용하여 이진코드로 변환해서 sqlite에 저장.
이후 그 이미지를 다시 조회하기 위해서 이진 형식을 다시 디지털로 변환해야함.
그러면 이미지를 저장하는 클래스하나 필요할거고
이미지를 조회하는게 필요할거 같은데
생성 하는 메소드 같은 경우는 api에서 실행하고
조회 하는 메소드 같은 경우는 클라이언트 쪽에서 요청하면 그 이미지를 변환해서 주는걸로 하자.
생각해보니까.. 이미지를 보러 갈건지 아닌지에 따라서 데이터베이스 요청이 달라질 수 있기 떄문에
그림이 생성되고 매번 그림을 생성하지 말고 그림을 본다고 했을 경우에만 클라이언트에서 다시 데이터 베이스 조회를 할 수 있도록 만들면 될거 같은데.
만약 생성된 이미지를 보지 않겠다고 한다면 구지 이미지를 선택해서 볼 필요가 없기 때문이지.
따라서 이미지를 본다고 했을 경우에만 조회를 하게 한다.
그러면 데이터를 조회해서 서버는 클라이언트 쪽에다가 변환된걸 넘겨주면 그 이미지를 js에서 보여줄 수 있는가.
'''

'''
@client_id = 클라이언트 아이디
@save_date = 이미지가 저장되는 시간
@image_info = 이미지를 바이너리로 처리.
@image_size = 이미지 사이즈를 저장.
'''
class SaveImage(models.Model):
    save_date = models.DateTimeField("date published")
    image_info = models.BinaryField()
    image_size = models.FloatField()
    
    
    # SaveImage object 형식으로 나오기 때문에
    # 스트링으로 변환해서 보여주는 함수가 필요. 따라서 정의.
    def __str__(self):
        return f'{self.save_date} {self.image_info} {self.image_size}'


# class ChoiceImage(models.Model):
# pass
# class Question(models.Model):
#     question_text = models.CharField(max_length=200)
#     pub_date = models.DateTimeField("date published")
    
#     def __str__(self):
#         return f'{self.question_text} {self.pub_date}'


# class Choice(models.Model):
#     question = models.ForeignKey(Question, on_delete=models.CASCADE)
#     choice_text = models.CharField(max_length=200)
#     votes = models.IntegerField(default=0)
    
#     def __str__(self):
#         return f'{self.question} {self.choice_text} {self.votes}'