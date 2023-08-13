from .stablediffusion_auto_1111 import StableDiffusionAuto1111
import random

class ImageStyleModel:
    
    def __init__(self, image_model_id, prompts_data, batch_size = None):
        self._model_id = image_model_id
        self._prompt = prompts_data
        self._batch_size = batch_size
        self._random_angle = ["low angle", "high angle", "middle angle", "dutch angle", "overhead shop", "eye level", "shoulder level"]
    
    # 모델 id에 따른 분기.
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
        print("요기오나?")
        print(self._prompt)
        generated_image = None
        
        positive_prompts = f'<lora:brighter-eye1:1>, {", ".join(self._prompt)}, smile, {random.sample(self._random_angle, 1)[0]}, masterpiece, best quality'
        negative_prompts = f'((lowres)), ((bad anatomy)), ((bad hands)), text, error, (missing fingers), extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, ((nsfw)), bad fingers'
        

        try:
            stablediffusion_sd_15 = StableDiffusionAuto1111(lora="brighter-eye1", 
                                                   model="manMaru.safetensors [aeb953ac1a]",
                                                   vae = "orangemix.vae.pt")

            
            
            # 모델이 성공적으로 바뀌었고, 배치사이즈가 정해진게 없을때
            if stablediffusion_sd_15.change_model() == 200 and self._batch_size is None:
                print("배치사이즈가 기본")
                generated_image = stablediffusion_sd_15.generate_image(image_model_id = self._model_id, 
                                                          prompt = positive_prompts, 
                                                          negative_prompt = negative_prompts)
            # 모델이 성공적으로 바뀌었고, 배치사이즈가 정해져 있을때
            elif stablediffusion_sd_15.change_model() == 200 and self._batch_size is not None:
                print("배치사이즈가 지정 되어 있음.")
                generated_image = stablediffusion_sd_15.generate_image(image_model_id = self._model_id, 
                                                          prompt = positive_prompts, 
                                                          negative_prompt = negative_prompts,
                                                          batch_size=self._batch_size)
                

        except Exception as e:
            return e

        
        # 이미지 path를 보냐주자
        if generated_image is not None:
            # path를 넘겨주게 되고
            return generated_image
    
    
    
    
    
    # anime model
    def civitai_anime_style(self):
        generated_image = None
        
        
        positive_prompts = f'(digital painting), (best quality), {", ".join(self._prompt)}, {random.sample(self._random_angle, 1)[0]}Ukiyo-e art style, Hokusai inspiration, Deviant Art popular, 8k ultra-realistic, pastel color scheme, soft lighting, golden hour, tranquil atmosphere, landscape orientation'
        negative_prompts = f'(lowres), (bad anatomy:1.2), (bad hands), text, error, (missing fingers), extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, ((nsfw)), bad fingers'
        

        try:
            stablediffusion_sd_15 = StableDiffusionAuto1111(lora="None", 
                                            model="anime.safetensors", 
                                            vae="orangemix.vae.pt")
            
            # 모델이 성공적으로 바뀌었고, 배치사이즈가 정해진게 없을때
            if stablediffusion_sd_15.change_model() == 200 and self._batch_size is None:
                print("배치사이즈가 기본")
                generated_image = stablediffusion_sd_15.generate_image(image_model_id = self._model_id, 
                                                          prompt = positive_prompts, 
                                                          negative_prompt = negative_prompts)
            # 모델이 성공적으로 바뀌었고, 배치사이즈가 정해져 있을때    
            elif stablediffusion_sd_15.change_model() == 200 and self._batch_size is not None:
                print("배치사이즈가 지정 되어 있음.")
                generated_image = stablediffusion_sd_15.generate_image(image_model_id = self._model_id, 
                                                          prompt = positive_prompts, 
                                                          negative_prompt = negative_prompts,
                                                          batch_size = self._batch_size)
            
        except Exception as e:
            return e

        
        if generated_image is not None:
            return generated_image
    
    