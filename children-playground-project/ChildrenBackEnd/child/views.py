from django.shortcuts import redirect, render
from django.http import HttpResponse, HttpResponseRedirect 
from django.http import JsonResponse as json
from django.templatetags.static import static
from .api.image_style_model import ImageStyleModel
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
def child_page(request):
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
모델 선택.
'''
def get_image(request):
    if request.method == "POST":
        print("잘옴")
        # @body = 바이트 객체를 json으로 변환 후 디코드해서 데이터를 유니코드화.
        # @request_body = json 객체로 변환된 데이터 중 'params' 데이터에 접근.
        body = json.loads(request.body.decode("utf-8"))
        request_body = body['params']

        
        # @image_model_id = 이미지 모델을 파싱해서 저장.
        # @prompts_data =  이중 리스트로 오기 때문에 [0]요소 접근(모든데이터)
        image_model_id = request_body["image_model"]
        # 리스트 타입으로 오니까
        # 해당 리스트 타입을 가지고 번역을 할 필요가 있겠구만
        prompt = request_body["prompt"] 
        
        translated_prompt = TransLate().translate(prompt)
        
        print(image_model_id, translated_prompt)
        # 이미지 모델 id 가 none?
        result = ImageStyleModel(image_model_id=image_model_id, prompts_data=translated_prompt)
        # base64로 인코드 되어 있는걸 보낸다.
        path = result.search_model()
        
        return HttpResponse("dddddd", content_type='image/png')
    else:
        return HttpResponse("Post Test Success")