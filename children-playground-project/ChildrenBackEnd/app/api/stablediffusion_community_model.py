# image generate model
from ..constants.constant import Constant
import requests
import json


class StableDiffusionCommunityModel:

    def __init__(self):
        self.constant = Constant() # constant class
        # get api key
        self.key = self.constant.get_key
        # dreambooth end point
        self.url = "https://stablediffusionapi.com/api/v4/dreambooth"
        pass

    # prompts, model_id, negative_prompts, positive_prompts를 넘겨준다.
    def get_image(self, image_model_id=None, positive_prompts=None, negative_prompts=None):
        # @TODO
        # image_model_id 에 따라 로라모델 사용여부 체크
        payload = json.dumps({
            # api key
            "key": f'{self.key}',
            # 사용할 모델
            "model_id": f'{image_model_id}',
            "prompt": f'{positive_prompts}',
            "negative_prompt": f'{negative_prompts}',
            # 너비
            "width": "512",
            # 높이
            "height": "512",
            # 이미지 개수
            "samples": "1",
            # ??
            "num_inference_steps": "30",
            # nsfw 방지
            "safety_checker": "yes",
            "enhance_prompt": "yes",
            "seed": None,
            "guidance_scale": 7.5,
            "multi_lingual": "no",
            "panorama": "no",
            "self_attention": "no",
            "upscale": "no",
            "embeddings_model": None,
            # image_model_id에 따라서 로라모델 사용여부 체크
            "lora_model": None,
            "tomesd": "yes",
            "use_karras_sigmas": "yes",
            "vae": None,
            "lora_strength": None,
            # 스케쥴러 선택.
            "scheduler": "UniPCMultistepScheduler",
            "webhook": None,
            "track_id": None
        })

        headers = {
            'Content-Type': 'application/json'
        }
        
        # 응답을 받아내고 
        try:
            response = requests.request("POST", self.url, headers=headers, data=payload)    
        except Exception as e:
            # 예외.
            print(e)
        

        # 응답을 받아냈기 때문에 여기에서
        # 이미지를 걸러서 클라이언트로 보내야 하는데
        # 우선적으로 이 이미지를 데이터베이스 저장할지 말지는 고민좀해보고 나오는거에 따라서.