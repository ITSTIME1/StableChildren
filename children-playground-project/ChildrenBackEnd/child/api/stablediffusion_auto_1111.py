import sys, random, requests, io, base64
from PIL import Image, PngImagePlugin
# from ..models import SaveImage
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
        self._end_point = "https://abf649db2037d12914.gradio.live"
        self._payload = {
            "restore_faces": True,
            "prompt": None,
            "negative_prompt": None,
            "batch_size": 4,
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
                    byte_path = []
                    image = None
                    # 이미지가 담긴 리스트를 가지고 있으니까
                    for i in r['images']:
                        # base64로 디코드 하기전 base64문자열을 전달해서 클라이언트에서 처리.
                        # byte_path.append(i[:10])
                        byte_path.append(i.split(",")[0])
                        # image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))
                        # image.show()   
                    # base64로 디코드 하지 않은걸 그대로 보내보자 
                    # batch_size만큼 byte_path에 넣어졌고
                    print(byte_path[0][-20:-1], byte_path[1][-20:-1])
                    # print(r['images'][0][-20:-1], r['images'][1][-20:-1])
                    return byte_path
                
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
# a = stable.generate_image("manMaru", "girl", "nsfw")
# print(a)

# stable.get_sampler()
# 테스트하기 위해서
# Ghibli를 선택하기 위해서
# Counterfeit 모델변경
# VAE 적용
# 로라 None
# stable.test_change_model()

# stable.get_model_name()
# stable.get_vae()
# stable.change_model()
# stable.get_LoRa()
# stable.get_options()

