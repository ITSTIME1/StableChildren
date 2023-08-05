from django.shortcuts import redirect, render
from django.http import HttpResponse, HttpResponseRedirect 
from django.http import JsonResponse as json
from django.templatetags.static import static
from .api.image_style_model import ImageStyleModel
import json

    

'''
Server-side rendering (SSR) is an application's ability to convert HTML files on the server into a fully rendered HTML page for the client.
관리자가 접속할 페이지를 렌더링 해줍니다. (선생님용)
'''
def manager_page(request):
    if request.method == "GET":
        return render(request, "child/manage.html")

'''
아이들 교육 파일 렌더링 함수.s
'''
def child_page(request):
    # 요청 method가 get일때 정적 파일을 넘겨준다.
    
    return render(request, 'child/main.html')
    
'''
아이들 핸드 인식 화면.
'''
def hand_detection_page(request):
   
    return render(request, 'child/hand_detection.html')


'''
모델을 선택하는 페이지
'''
def model_choice_page(request):
    return render (request, 'child/model_choice.html')




'''
모델 선택.
'''
def get_image(request):
    if request.method == "POST":
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