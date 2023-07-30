import random
import requests
import io
import base64
from PIL import Image, PngImagePlugin
    
index = 0

# ddtailer라는 것도 고려해볼 만한네

class StableDiffusionAuto1111:
    def __init__(self):
        self._endPoint = "https://3660ab4c563d8f8763.gradio.live"
        self._save_path = "/Users/itstime/children-playground/children-playground-project/ChildrenFrontEnd/src/generatedImages"
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

    # 이미지 얻기
    # 이미지를 얻기 위해서 어떤 모델을 사용할지 받아오고
    # 1. 그 모델로 체인지 로라면 로라 모델이면 모델
    # 2. 모델이 바뀌어 질때까지 기다려야 하고 모델이 바뀌어 지고 난 다음에 이미지를 생성하도록 api를 구성해주면 될거 같은데
    # 3. 비동기로 하면 안되는게 이건 절대적으로 기다려야 한다. 그렇지 않으면 다른 결과물이 나올 수 있기 떄문임.
    # 4. 이미지가 나왔으면 데이터베이스에다가 저장해두면 좋을거 같긴한데 (데베를 아직 할 줄 모르니까 일단 이건 패스 테스트 환경이니까)
    # 5. 근데 그러면 가능할거 깉은ㄷ[
    def get_image(self, image_model_id, prompt = None, negative_prompt = None):
        
        # 긍정과 부정 프롬포트를 설정해준다
        # 긍정, 부정은 공통사항
        self._payload['prompt'] = prompt
        self._payload['negative_prompt'] = negative_prompt
        

        # 이미지 모델에 따라 cfg_scale과 steps 변경
        result = None
        
        
        if image_model_id == "Manmaru":
            self._payload['cfg_scale'] = 11
            self._payload['steps'] = 22
        else:
            self._payload['cfg_scale'] = 8.5
            self._payload['steps'] = 30
        
        try:
            response = requests.post(url=f'{self._endPoint}/sdapi/v1/txt2img', json=self._payload)

            r = response.json()

            for i in r['images']:
                image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))

                png_payload = {
                    "image": "data:image/png;base64," + i
                }
                
                image_info = requests.post(url=f'{self._endPoint}/sdapi/v1/png-info', json=png_payload)


                if image_info.status_code == 200:
                    pnginfo = PngImagePlugin.PngInfo()
                    pnginfo.add_text("parameters", image_info.json().get("info"))
                    # 1~부터 9999까지의 랜덤 정수를 사용해서 저장
                    # 이건 나중에 데이터베이스에다가 저장하는거랑 다르게 하면됨.
                    random_number = random.randrange(1, 10000)
                    path = f'{random_number}.png'
                    # 랜덤 넘버를 생성해서 이미지를 저장할건데
                    # 이미지를 저장하기 위해서 어떠한 경로가 필요할거고
                    # 그 경로를 명시해서 저장하는게 필요할것이다.
                    image.save(f'{self._save_path}/{random_number}.png', pnginfo=pnginfo)
                    result = path 
                    return result
        except Exception as e:
            print(e)

    

    # model 바꾸기
    def change_model(self, loRa = None, model=None, vae=None):
        # 모델을 바꾸는건 성공적으로 되네
        self._option_payload["sd_model_checkpoint"] = model
        self._option_payload["sd_lora"] = loRa
        self._option_payload["sd_vae"] = vae
            
        try:
            response = requests.post(url=f'{self._endPoint}/sdapi/v1/options', json=self._option_payload)
        except Exception as e:
            print(e)
        
        # 만약 response 응답 코드가 정상적이라면( 모델이 정상적으로 적용 되었다면 200을 리턴)
        if response.status_code == 200:
            print("Success Change Model")
            return response.status_code
        # 만약 response 응답 코드가 그 외에 것이라면 (422) 제대로 바뀌지 않았다는 걸 알려줌 
        else:
            print("Faile Change Model")
            return 422
        
    # 옵션들 보기
    def get_options(self):
        try:
            response = requests.get(url=f'{self._endPoint}/sdapi/v1/options')
            print(response.json())
        except Exception as e:
            print(f'Error : {e}')
        
        
    # 모델 이름 가져오기
    def get_model_name(self):
        try:
            response = requests.get(url=f'{self._endPoint}/sdapi/v1/sd-models') 
            r = response.json()
            print(r)
        except Exception as e:
            print(e)
            
    # 샘플러 다 보기
    def get_sampler(self):
        response = requests.get(url=f'{self._endPoint}/sdapi/v1/samplers')
        r = response.json()
        print(r)
            
    # lora model 가져오기
    def get_LoRa(self):
        response = requests.get(url=f'{self._endPoint}/sdapi/v1/loras')
        r = response.json()
        print(r)
        
    # 현재 옵션 상태가져오기
    def get_options(self):
        response = requests.get(url=f'{self._endPoint}/sdapi/v1/options')
        r = response.json()
        print(r)
        
    # vae 목록 가져오기
    def get_vae(self):
        response = requests.get(url=f'{self._endPoint}/sdapi/v1/sd-vae')
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
    #         url=f'{self._endPoint}/sdapi/v1/txt2img', json=self._payload)

    #         r = response.json()

    #         for i in r['images']:
    #             image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))

    #             png_payload = {
    #                 "image": "data:image/png;base64," + i
    #             }
    #             response2 = requests.post(url=f'{self._endPoint}/sdapi/v1/png-info', json=png_payload)

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
    #         response = requests.post(url=f'{self._endPoint}/sdapi/v1/options', json=option_payload)
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

