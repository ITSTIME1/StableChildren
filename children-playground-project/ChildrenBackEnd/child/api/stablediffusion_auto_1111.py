import sys, random, requests, io, base64
from PIL import Image, PngImagePlugin
from ..models import SaveImage
from datetime import datetime as dt
from datetime import time
from django.utils import timezone

INF = 100000

class StableDiffusionAuto1111:
    def __init__(self, lora=None, model=None, vae=None):
        self._result = None 
        self._lora = lora
        self._model = model
        self._vae = vae
        self._end_point = "https://4163d3f7e7fd4f65af.gradio.live"
        self._payload = {
            "restore_faces": True,
            "prompt": None,
            "negative_prompt": None,
            "batch_size": 1,
            "steps": None,
            "cfg_scale": None,
            "width": 512,
            "height": 768,
            "sampler_index": "DPM++ 2M"
        }
        
        self._option_payload = {
            "sd_model_checkpoint": None,
            "CLIP_stop_at_last_layers": 2,
            "sd_lora": None,
            "sd_vae": None,
        }

        # self._override_settings = {'sd_model_checkpoint' : "", 'filter_nsfw' : True}


    def generate_image(self, image_model_id=None, prompt = None, negative_prompt = None):
        
        if image_model_id == None: 
            return None
        
        '''
        이미지 모델 id가 None이 아니면 실행되게 되고, 이미지 모델 id에 따라서 payload 설정.
        prompt, negative_prompt 는 공통적용 사항
        '''
        if (prompt is not None) and (negative_prompt is not None):
            self._payload['prompt'] = prompt
            self._payload['negative_prompt'] = negative_prompt

            if image_model_id == "Manmaru":
                self._payload['cfg_scale'] = 11
                self._payload['steps'] = 22
            else:
                self._payload['cfg_scale'] = 8.5
                self._payload['steps'] = 30

            try:
                response = requests.post(url=f'{self._end_point}/sdapi/v1/txt2img', json=self._payload)

                if response.status_code == 200:
                    r = response.json()

                    byte_path = None
                    image = None
                    for i in r['images']:
                        byte_path = i.split(",",1)[0]
                        # print(type(i.split(",",1)[0]))
                        image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))
                        # byte_path = base64.b64decode(i.split(",",1)[0])
                        # 이미지는 잘 나오네
                        # 이미지 먼저 확인용
                        image.show()   
                    # base64로 디코드 하지 않은걸 그대로 보내보자 
                    return byte_path

                        # 바이너리 데이터를 얻어서 메모리 내의 바이트 스트림으로 열고, 바이트 스트림을 Image.open()을 통해서
                        # 이미지 객체로 만든다. 이 PIL 이미지 객체를 활용해서 pnginfo와 함께
                        # 이미지를 저장하는데 쓰이는데 구지 필요 없을 거같다.
                        # 이미지 객체의 메모리를 얻기 위해서 사용하자.
                        # image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))
                        # png_payload = {
                        #     "image": "data:image/png;base64," + i
                        # }
                        
                        # 다른 경로에도 영향을 미치는지 확인을 좀 해보자
                        # 맞네 다른 경로에 저장하면 상관이 없네
                        # 그럼 로컬 데이터베이스에 저장하면 안되고 외부 db를 써야 되겠네
                        # 외부 로컬 디비에 넣으면 아무런 영향을 안미치니까
                        # 이미지의 정보를 뽑아오고
                        # image_info = requests.post(url=f'{self._end_point}/sdapi/v1/png-info', json=png_payload)

                        # print(image_info.status_code)
                        # if image_info.status_code == 200:
                            # pnginfo = PngImagePlugin.PngInfo()
                            # pnginfo.add_text("parameters", image_info.json().get("info"))
                            # file_number = random.randrange(1,INF)
                        

                            # console.log(url);
                            # 이런 방법을 이용하면 되겠다
                            # 먼저 외부 DB에 연결한 다음에
                            # 그 외부 DB에 저장되어 있는 이미지 binary code를
                            # 클라이언트 쪽에서 해석한 다음에
                            # 그걸 하나의 임시 url로 만들어서 이미지를 보여주면 되겠다
                            # 그러면 이미지는 저장되어 있고
                            # 그 이미지를 보고 싶을때마다 유효키를 검색해서 보여줄 수 있기 때문에
                            # 이 방법도 괜찮을 거 같은데
                            # save_path = f'/Users/itstime/testImages/{file_number}.png'
                            # image.save(save_path, pnginfo=pnginfo)

                            # return save_path
                            
                            # datetime_object로 리턴하기 때문에 str을 통해서 parsing
                            # date_time = str(dt.now())
                            # current_time = date_time.split(" ")[1].split(":")
                            # current_time[2] = round(float(current_time[2]), 0)
                            # current_time = list(map(int, current_time))
                            
                            # parsed_time = time(current_time[0], current_time[1], current_time[2])
                            # # 데이터베이스 정보 생성
                            # '''
                            # @image_object = 이미지 저장 테이블 (sqlite3)
                            # @model_name = 모델 이름
                            # @image_info = 이미지 바이너리 데이터
                            # # default로 저장해주는 것.
                            # @image_date = 이미지 생성 날짜
                            # @image_time = 이미지 생성 시간
                            # @image_size = 이미지 크기(바이트 단위)
                            # '''
                            
                            
                            # 로컬 디비에 하는 것도 생각해보니까 로컬에 저장하는 것이기 때문에 새로 고침당하는구나
                            # 그럼 거에다가 저장해보자
                            # 데이터 베이스 저장할때도 navigate를 하네 저장을 해서 그런가.
                            # image_object = SaveImage()
                            # image_object.model_name = image_model_id
                            # image_object.image_info = binary_data
                            # # 이미지의 메모리 크기는 바이트 단위로
                            # image_object.image_size = sys.getsizeof(image)
                            
                            # print(f'{image_object.model_name}, {image_object.image_date}')
                            # print("Successful saved in database")
                            # image_object.save()
            except Exception as e:
                return e

        
        
    

    # model 변경
    def change_model(self):
        # 모델을 바꾸는건 성공적으로 되네
        self._option_payload["sd_model_checkpoint"] = self._model
        self._option_payload["sd_lora"] = self._lora
        self._option_payload["sd_vae"] = self._vae
            
        try:
            response = requests.post(url=f'{self._end_point}/sdapi/v1/options', json=self._option_payload)
            
            if response.status_code == 200:
                print("Successful Model Change")
                return response.status_code
            else:
                return "error"
            
        except Exception as e:
            return e

        
        
        
    # 옵션들 보기
    def get_options(self):
        try:
            response = requests.get(url=f'{self._end_point}/sdapi/v1/options')
            print(response.json())
        except Exception as e:
            print(f'Error : {e}')
        
        
    # 모델 이름 가져오기
    def get_model_name(self):
        try:
            response = requests.get(url=f'{self._end_point}/sdapi/v1/sd-models') 
            r = response.json()
            print(r)
        except Exception as e:
            print(e)
            
    # 샘플러 다 보기
    def get_sampler(self):
        response = requests.get(url=f'{self._end_point}/sdapi/v1/samplers')
        r = response.json()
        print(r)
            
    # lora model 가져오기
    def get_LoRa(self):
        response = requests.get(url=f'{self._end_point}/sdapi/v1/loras')
        r = response.json()
        print(r)
        
    # 현재 옵션 상태가져오기
    def get_options(self):
        response = requests.get(url=f'{self._end_point}/sdapi/v1/options')
        r = response.json()
        print(r)
        
    # vae 목록 가져오기
    def get_vae(self):
        response = requests.get(url=f'{self._end_point}/sdapi/v1/sd-vae')
        r = response.json()
        print(r)
        
        
    # def test_image(self):
    #     result = None
    #     self._payload = {
    #         "restore_faces": True,
    #         "prompt": "<lora:brighter-eye1:1>, (1girl), (smile), masterpiece, best quality, high quality",
    #         "negative_prompt": "ugly, lowres, (bad fingers:1.2), (bad anatomy:1.1), bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, nsfw",
    #         "batch_size": 1,
    #         "steps": 22,
    #         "cfg_scale": 11,
    #         "width": 512,
    #         "height": 768,
    #         "sampler_index": "DPM++ 2M"
    #     }
    #     try:
            
    #         response = requests.post(
    #         url=f'{self._end_point}/sdapi/v1/txt2img', json=self._payload)

    #         r = response.json()

    #         for i in r['images']:
    #             image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))

    #             png_payload = {
    #                 "image": "data:image/png;base64," + i
    #             }
    #             response2 = requests.post(url=f'{self._end_point}/sdapi/v1/png-info', json=png_payload)

    #             # png 정보를 성공적으로 받아 왔을때만 이미지를 저장한다.
    #             # 이미지를 줄지 아니면 음... 이미지 path를 주는게 가장 현명하지 않을까
    #             # 그 해당 이미지의 path만 찾아서 준다면
    #             # 웹 상에서는 그 이미지 path만 img src로 보여주면 되니까
    #             # 그러면 가능할거 같은데
    #             # 이미지에 랜덤 번호를 부여하는건 어떨까
    #             # 그러면 겹칠일도 없고  
    #             if response2.status_code == 200:
    #                 pnginfo = PngImagePlugin.PngInfo()
    #                 pnginfo.add_text("parameters", response2.json().get("info"))
    #                 # 1~부터 9999까지의 랜덤 정수를 사용해서 저장
    #                 # 이건 나중에 데이터베이스에다가 저장하는거랑 다르게 하면됨.
    #                 random_number = random.randrange(1, 10000)
    #                 result = random_number
    #                 image.save(f'{random_number}.png', pnginfo=pnginfo)

    #             else:
    #                 result = -1
                
    #     except Exception as e:
    #         print(e)

    #     return result
    # # 이미지를 한번씩 초기화 하자
    
    # def test_change_model(self):
    #     # option choice
    #     # manMaru + brighter-eye1, none
    #     # anime + none + orangeMix
    #     # counterfeit + ghibli + clear vae
    #     # counterfeit + chesedays + clear vae
    #     option_payload = {
    #         "sd_model_checkpoint": "manMaru.safetensors [aeb953ac1a]",
    #         "CLIP_stop_at_last_layers": 2,
    #         "sd_lora": "brighter-eye1",
    #         "sd_vae" : "orangemix.vae.pt",
    #     }
    #     # 모델을 바꾸는건 성공적으로 되네
    #     try: 
    #         response = requests.post(url=f'{self._end_point}/sdapi/v1/options', json=option_payload)
    #     except Exception as e:
    #         print(e)
        
    #     # 만약 response 응답 코드가 정상적이라면( 모델이 정상적으로 적용 되었다면 200을 리턴)
    #     if response.status_code == 200:
    #         print(response.status_code)
    #         return response.status_code
    #     # 만약 response 응답 코드가 그 외에 것이라면 (422) 제대로 바뀌지 않았다는 걸 알려줌 
    #     else:
    #         return 422

# stable = StableDiffusionAuto1111()
# stable.get_sampler()
# 테스트하기 위해서
# Ghibli를 선택하기 위해서
# Counterfeit 모델변경
# VAE 적용
# 로라 None
# stable.test_change_model()
# stable.test_image()
# stable.get_model_name()
# stable.get_vae()
# stable.change_model()
# stable.get_LoRa()
# stable.get_options()

