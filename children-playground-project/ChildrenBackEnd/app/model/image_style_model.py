from ..api.stablediffusion_community_model import StableDiffusionCommunityModel
from ..constants.constant import Constant

class ImageStyleModel:
    # image_model_id를 받아서 함수 실행
    def __init__(self):
        self.stablediffusion = StableDiffusionCommunityModel()
        self.constant = Constant()
        pass

    def search_model(self, image_model_id=None, prompts_data=None):
        # image_model_id가 None인경우.
        if image_model_id is None:
            return "올바르지 못한 데이터입니다."

        if image_model_id == "Manmaru mix":
            
            return self.civitai_manmaru_mix_style(image_model_id, prompts_data)

        elif image_model_id == "Cheese Daddy's Landscapes mix 3.5":
            return self.civitai_cheese_daddys_landscapes_mix_v_35_style(image_model_id, prompts_data)
        
        
        # elif image_model_id == "3":
        #     return self.civitai_niji_visual_novel_background_style(image_model_id, prompts_data)
            
        elif image_model_id == "Ghibli background":
            return self.civitai_ghibli_background_style(image_model_id, prompts_data)

    
    
    
    
    # Manmaru mix SD1.5
    def civitai_manmaru_mix_style(self, image_model_id=None, user_prompts=None):
        positive_prompts = f'{", ".join(user_prompts)}, {self.constant.get_man_maru_positve}'
        negative_prompts = f'{self.constant.get_man_maru_negative}'
        
        # print(f'{positive_prompts}, {negative_prompts}')

        return self.stablediffusion.get_image(image_model_id=image_model_id,
                                              positive_prompts=positive_prompts,
                                              negative_prompts=negative_prompts)
        
        
        
    # Cheese Daddy's Landscapes mix 3.5 LoRA Extract (LoRa Model)
    def civitai_cheese_daddys_landscapes_mix_v_35_style(self, image_model_id, user_prompts=None):
        # @TODO 특정 ng, pg 프롬포트랑 같이 보냄
        # 여기서 특정 모델에 prompt를 저장
        positive_prompts = ""
        negative_prompts = ""
        return self.stablediffusion.get_image(image_model_id=image_model_id,
                                              positive_prompts=positive_prompts,
                                              negative_prompts=negative_prompts)



    # Niji Visual Novel Background
    def civitai_niji_visual_novel_background_style(self, image_model_id, user_prompts=None):
        # @TODO 특정 ng, pg 프롬포트랑 같이 보냄
        # 여기서 특정 모델에 prompt를 저장
        positive_prompts = f'masterpiece, ligth, {user_prompts}' 
        negative_prompts = ""
        return self.stablediffusion.get_image(image_model_id=image_model_id,
                                              positive_prompts=positive_prompts,
                                              negative_prompts=negative_prompts)
        
        
        
    
    # GHIBLI_Background (LoRa)
    def civitai_ghibli_background_style(self, image_model_id, user_prompts=None):
        # @TODO 특정 ng, pg 프롬포트랑 같이 보냄
        # 여기서 특정 모델에 prompt를 저장
        positive_prompts = ""
        negative_prompts = ""
        return self.stablediffusion.get_image(image_model_id=image_model_id,
                                              positive_prompts=positive_prompts,
                                              negative_prompts=negative_prompts)
