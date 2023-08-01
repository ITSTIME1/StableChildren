from django.shortcuts import render
from django.http import HttpResponse 
from django.http import JsonResponse as json
from .api.image_style_model import ImageStyleModel
import json, base64


def get_image(request):
    if request.method == "POST":
        client_ip = request.META['HTTP_REFERER']
        # @body = 바이트 객체를 json으로 변환 후 디코드해서 데이터를 유니코드화.
        # @request_body = json 객체로 변환된 데이터 중 'params' 데이터에 접근.
        body = json.loads(request.body.decode("utf-8"))
        request_body = body['params']

        
        # @image_model_id = 이미지 모델을 파싱해서 저장.
        # @prompts_data =  이중 리스트로 오기 때문에 [0]요소 접근(모든데이터)
        image_model_id = request_body["image_model"]
        prompt = request_body["prompt"][0] 
        
        print(image_model_id, prompt)
        # 이미지 모델 id 가 none?
        result = ImageStyleModel(image_model_id=image_model_id, prompts_data=prompt)
        # base64로 인코드 되어 있는걸 보낸다.
        path = result.search_model()
        
        return HttpResponse(path, content_type='image/png')
    else:
        return HttpResponse("Post Test Success")