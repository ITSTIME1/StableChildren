from .stablediffusion_auto_1111 import StableDiffusionAuto1111
from ..constants.constant import Constant

class ImageStyleModel:
    
    def __init__(self, image_model_id = None, prompts_data = None):
        self._model_id = image_model_id
        self._prompt = prompts_data
    
    
    def search_model(self):
        # self._model_id가 None인경우.
        if self._model_id is None:
            return "올바르지 못한 데이터입니다."

        if self._model_id == "manMaru":
            return self.civitai_manmaru_mix_style()

        elif self._model_id == "anime":
            return self.civitai_anime_style()
    

    # Manmaru mix SD1.5
    def civitai_manmaru_mix_style(self):  
        print("manMaru 스타일")
        generated_image = None
        
        positive_prompts = f'<lora:brighter-eye1:1>, {", ".join(self._prompt)}, smile, low angle, masterpiece, best quality'
        negative_prompts = f'(lowres), (bad anatomy:1.2), (bad hands), text, error, (missing fingers), extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, ((nsfw)), bad fingers'
        

        try:
            model = StableDiffusionAuto1111(lora="brighter-eye1", 
                                                   model="manMaru.safetensors [aeb953ac1a]",
                                                   vae = "orangemix.vae.pt")

            
            # 모델을 변경해서 얻어낸 status_code 가 정상코드일때
            if model.change_model() == 200:
                generated_image = model.generate_image(image_model_id = self._model_id, 
                                                          prompt = positive_prompts, 
                                                          negative_prompt = negative_prompts)
            
            
        except Exception as e:
            return e

        
        # 이미지 path를 보냐주자
        if generated_image is not None:
            # path를 넘겨주게 되고
            return generated_image
    
    
    # anime model
    # 동물, 풍경 실사화 모델
    def civitai_anime_style(self):
        generated_image = None
        
        
        positive_prompts = f'(digital painting), (best quality), {", ".join(self._prompt)}, Ukiyo-e art style, Hokusai inspiration, Deviant Art popular, 8k ultra-realistic, pastel color scheme, soft lighting, golden hour, tranquil atmosphere, landscape orientation'
        negative_prompts = f'(lowres), (bad anatomy:1.2), (bad hands), text, error, (missing fingers), extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, ((nsfw)), bad fingers'
        

        try:
            model = StableDiffusionAuto1111(lora="None", model="anime.safetensors", vae="orangemix.vae.pt")
            
            changed_model = model.change_model()
            
            # 모델이 정상적으로 수신 되었기 때문에 이미지를 생성한다.
            if changed_model == 200:
                generated_image = model.generate_image(image_model_id = self._model_id,
                                                             prompt = positive_prompts, 
                                                             negative_prompt = negative_prompts)
            
            # 이미지 path를 보냐주자
            # 이제 여기서 이미지를 받아오는게 아니라 성공적인것만 적용해준다면 database system 에서 
            if generated_image is not None:
                # path를 넘겨주게 되고
                print(generated_image)
                return generated_image
            
        except Exception as e:
            return e

    
    