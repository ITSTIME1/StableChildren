from django.shortcuts import render
from django.http import HttpResponse 
from django.http import JsonResponse as json
from .model.image_style_model import ImageStyleModel as GenerateImage
import json

# Create your views here.
# views 처리해야될 구조는 우선

def index(request):
    return HttpResponse("Hello, World")


'''
클라이언트에서 이미지를 얻기 위한 함수.
'''
def get_image(request):
    if request.method == "POST":
        
        # @body = 바이트 객체를 json으로 변환 후 디코드해서 데이터를 유니코드화.
        # @request_body = json 객체로 변환된 데이터 중 'params' 데이터에 접근.
        body = json.loads(request.body.decode("utf-8"))
        request_body = body['params']
        
        # @image_model_id = 이미지 모델을 파싱해서 저장.
        # @prompts_data =  이중 리스트로 오기 때문에 [0]요소 접근(모든데이터)
        image_model_id = request_body["image_style"]
        prompts_data = request_body["prompt"][0] 
        
        # data test 
        # print(f"{image_model_id}, {prompts_data}")
        
        """
            @image_model_obj = 이미지 스타일의 아이디, 입력 프롬포트를 ImageStyleModel 객체에 넘겨주고
                                ImageStyle 에서 모델 아이디를 탐색 후 StableDiffusion Model을 통해 API 호출결과를 반환.
            
            @result = 생성된 이미지를 받음.
        """
        result = GenerateImage().search_model(image_model_id='1')
        print(result)

        return HttpResponse("Post Test Success")
    else:
        return HttpResponse("Post Test Success")