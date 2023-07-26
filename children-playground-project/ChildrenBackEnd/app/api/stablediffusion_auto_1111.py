import json
import requests
import io
import base64
from PIL import Image, PngImagePlugin
    
index = 0

# ddtailer라는 것도 고려해볼 만한네

class StableDiffusionAuto1111:
    def __init__(self):
        self._endPoint = "https://af98c566f157fdd312.gradio.live"
        self._payload = {
            "hr_scale": 2,
            "restore_faces": True,
            "prompt": "<lora:brighter-eye1:1>, masterpiece, best quality, 1girl, (white long hair:1.2), (printing blue shirts:1), city, evening, smile, looking at viewer",
            "negative_prompt": "lowres, (bad anatomy:1.2), bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, nsfw, bad fingers",
            "batch_size": 1,
            "steps": 20,
            "cfg_scale": 7,
            "width": 512,
            "height": 768,
            "sampler_index": "DPM++ 2M"
        }

        # self._override_settings = {'sd_model_checkpoint' : "", 'filter_nsfw' : True}

    def get_image(self):
        global index
        try:
            response = requests.post(
            url=f'{self._endPoint}/sdapi/v1/txt2img', json=self._payload)

            r = response.json()

            for i in r['images']:
                image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))

                png_payload = {
                    "image": "data:image/png;base64," + i
                }
                response2 = requests.post(url=f'{self._endPoint}/sdapi/v1/png-info', json=png_payload)

                pnginfo = PngImagePlugin.PngInfo()
                pnginfo.add_text("parameters", response2.json().get("info"))
                image.save(f'{index}.png', pnginfo=pnginfo)
                print("Successful")
                index += 1
        except Exception as e:
            print(e)


    # model 바꾸기
    def change_model(self):
        option_payload = {
            "sd_model_checkpoint": "manMaru.safetensors [aeb953ac1a]",
            "CLIP_stop_at_last_layers": 2,
            "sd_lora": "brighter-eye1",
        }
        
        # 모델을 바꾸는건 성공적으로 되네
        response = requests.post(url=f'{self._endPoint}/sdapi/v1/options', json=option_payload)
        print(response)
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
        
    # 이미지를 한번씩 초기화 하자
    

stable = StableDiffusionAuto1111()
# stable.get_sampler()
stable.get_image()
# stable.change_model()
# stable.get_LoRa()
# stable.get_options()

# [
#     {
#         'name': 'bigeye1',
#         'alias': 'bigeye1',
#         'path': '/content/gdrive/MyDrive/sd/stable-diffusion-webui/models/Lora/bigeye1.safetensors',
#         'metadata': {}
#     },
#     {
#         'name': 'bigeye2',
#         'alias': 'bigeye2',
#         'path': '/content/gdrive/MyDrive/sd/stable-diffusion-webui/models/Lora/bigeye2.safetensors',
#         'metadata': {
#             'ss_network_alpha': '16.0',
#             'ss_network_dim': '16',
#             'ss_training_comment': 'dimension is resized from 256 to 16; ',
#             'sshs_legacy_hash': '5b1952ee',
#             'sshs_model_hash': 'bb35c1359e9fd3f1e122c39ee72be6330eb1335b727b6e6621585aaad399aa0f'
#         }
#     },
#     {
#         'name': 'brighter-eye1',
#         'alias': 'brighter-eye1',
#         'path': '/content/gdrive/MyDrive/sd/stable-diffusion-webui/models/Lora/brighter-eye1.safetensors',
#         'metadata': {}
#     },
#     {
#         'name': 'brighter-eye2',
#         'alias': 'brighter-eye2',
#         'path': '/content/gdrive/MyDrive/sd/stable-diffusion-webui/models/Lora/brighter-eye2.safetensors',
#         'metadata': {}
#     },
#     {
#         'name': 'COOLKIDS_MERGE_V2.5',
#         'alias': 'COOLKIDS_MERGE_V2.5',
#         'path': '/content/gdrive/MyDrive/sd/stable-diffusion-webui/models/Lora/COOLKIDS_MERGE_V2.5.safetensors',
#         'metadata': {}
#     }
# ]




