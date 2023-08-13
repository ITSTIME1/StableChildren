import sys, random, requests, io, base64
from PIL import Image, PngImagePlugin

class StableDiffusionAuto1111:
    def __init__(self, lora=None, model=None, vae=None):
        self._result = None 
        self._lora = lora
        self._model = model
        self._vae = vae
        self._end_point = "[Colab server address]"
        self._payload = {
            "restore_faces": True,
            "prompt": None,
            "negative_prompt": None,
            "batch_size": None,
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


    def generate_image(self, image_model_id=None, prompt = None, negative_prompt = None, batch_size = None):
        
        if image_model_id == None: 
            return None
        if batch_size is not None:
            print("여기")
            self._payload["batch_size"] = batch_size
        else:
            self._payload["batch_size"] = 4
        
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
                    byte_path = [i.split(",")[0] for i in r["images"]]
                    return byte_path
                
            except Exception as e:
                return e

        
        
    

    def change_model(self):
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
        