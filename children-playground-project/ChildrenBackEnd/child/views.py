from django.shortcuts import redirect, render
from django.http import JsonResponse 
from django.http import JsonResponse as json
from django.templatetags.static import static
from .api.image_style_model import ImageStyleModel
# 상위 폴더에서는 상대경로를 사용할 수 있다.
from .api.translate import TransLate
import json

    

'''
Server-side rendering (SSR) is an application's ability to convert HTML files on the server into a fully rendered HTML page for the client.
관리자가 접속할 페이지를 렌더링 해줍니다. (선생님용)
'''
def manager_page(request):
    if request.method == "GET":
        return render(request, "child/manage.html")

'''
( 아이들 교육 파일 ) 렌더링 함수.
'''
def main_page(request):
    # 요청 method가 get일때 정적 파일을 넘겨준다.
    
    return render(request, 'child/main.html')
    
'''
( 아이들 핸드 인식 ) 렌더링 함수.
'''
def hand_detection_page(request):
   
    return render(request, 'child/hand_detection.html')


'''
모델을 선택하는 페이지
'''
def model_choice_page(request):
    return render (request, 'child/model_choice.html')

'''
로딩 페이지
'''
def loading_page(request):
    return render(request, 'child/loading.html')

'''
미디어 파이프 테스트 웹 페이지
'''
def mediapipe_test(request):
    return render(request, 'child/mediapipe_test.html')


'''
모델 선택.
'''
def get_image(request):
    if request.method == "POST":
        
        body = json.loads(request.body.decode("utf-8"))
        request_body = body['params']

        
        image_model_id = request_body["image_model"]
        prompt = request_body["prompt"] 
        
        # 프롬포트가 없다면 400에러
        if len(prompt) == 0:
            payload = {
                'status_code' : 400,
            }
            return JsonResponse(payload)
        else:
            
            selected_model = ImageStyleModel(image_model_id = image_model_id, 
                                     prompts_data = TransLate().translator(prompt))
            
            base64Encoding = selected_model.search_model()
            
            payload = {
                "imagesByteString" : base64Encoding,
                'status_code' : 200,
            }
            return JsonResponse(payload)
    

'''
이미지 재생성.
'''
def get_regenerate_image(request):
    if request.method == "POST":
        
        body = json.loads(request.body.decode("utf-8"))
        request_body = body['params']

        
        image_model_id = request_body["image_model"]
        prompt = request_body["prompt"] 
        batch_size = request_body["batch_size"]
        
        # 프롬포트가 없다면 400에러
        if len(prompt) == 0:
            payload = {
                'status_code': 400,
            }
            return JsonResponse(payload)
        else:
            
            selected_model = ImageStyleModel(image_model_id=image_model_id, 
                                     prompts_data=TransLate().translator(prompt), 
                                     batch_size=batch_size)

            base64Encoding = selected_model.search_model()

            payload = {
                    "regenerate_base64_image" : base64Encoding,
                    "status_code": 200,
            }
            return JsonResponse(payload)