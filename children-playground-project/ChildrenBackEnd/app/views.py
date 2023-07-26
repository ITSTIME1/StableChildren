from django.shortcuts import render
from django.http import HttpResponse 
from django.http import JsonResponse as json
from .model.image_style_model import ImageStyleModel as GenerateImage
import json


def get_image(request):
    if request.method == "POST":
        
        # @body = 바이트 객체를 json으로 변환 후 디코드해서 데이터를 유니코드화.
        # @request_body = json 객체로 변환된 데이터 중 'params' 데이터에 접근.
        body = json.loads(request.body.decode("utf-8"))
        request_body = body['params']
        
        # @image_model_id = 이미지 모델을 파싱해서 저장.
        # @prompts_data =  이중 리스트로 오기 때문에 [0]요소 접근(모든데이터)
        image_model_id = request_body["image_model"]
        prompts_data = request_body["prompt"][0] 
        
        # data test 
        # print(f"{image_model_id}, {prompts_data}")
        
        """
            @image_model_obj = 이미지 스타일의 아이디, 입력 프롬포트를 ImageStyleModel 객체에 넘겨주고
                                ImageStyle 에서 모델 아이디를 탐색 후 StableDiffusion Model을 통해 API 호출결과를 반환.
            
            @result = 생성된 이미지를 받음.
        """
        # 여기에서 이미지 결과를 받게 될거니까
        # 결과 이미지를 받았을때 데이터베이스에 저장을 해서
        # 이후 나중에 기능을 추가했을때 이전 이미지들을 보고 싶다고 했을때
        # 해당 이미지들을 불러오는 기능을 만든다면
        # 데이터베이스에서 꺼내올 수 있을 것 같은데
        # print(f'{image_model_id}, {prompts_data}')
        result = GenerateImage().search_model(image_model_id=image_model_id, prompts_data=prompts_data)
        print(result)

        return HttpResponse("Post Test Success")
    else:
        return HttpResponse("Post Test Success")