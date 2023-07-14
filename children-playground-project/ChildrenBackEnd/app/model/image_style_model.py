from ..api.stablediffusion_community_model import StableDiffusionCommunityModel


class ImageStyleModel:
    # image_model_id를 받아서 함수 실행
    def __init__(self):
        self.stablediffusion = StableDiffusionCommunityModel()
        pass

    def search_model(self, image_model_id=None, prompts_data=None):
        # image_model_id가 None인경우.
        if image_model_id is None:
            return "올바르지 못한 데이터입니다."

        if image_model_id == "1":

            # @TODO
            # 그럼 이제 모델을 좀 선별을 해봐야 하는데 좀 테스트를 해서 괜찮은 모델을 좀 선정해보자
            # 4개 정도의 모델을 사용하는게 어떨까 싶은데
            # 우선 베타 테스트 정도는 4개 모델로 만들어주고
            # 이후에 추가적으로 개발하게 되면 학습 모델을 추가하는 방법으로 진행하는게 좋을거 같음

            # 1. Manmaru mix
            # 2. Cheese Daddy's Landscapes mix 3.5 LoRA Extract (LoRa Model)
            # 3. Niji Visual Novel Background (LoRa Model)
            # 4. GHIBLI_Background (LoRa)
            return self.civitai_manmaru_mix_style(image_model_id, prompts_data)
        
        elif image_model_id == "2":
            return self.civitai_cheese_daddys_landscapes_mix_v_35_style(image_model_id, prompts_data)
        
        
        elif image_model_id == "3":
            return self.civitai_niji_visual_novel_background_style(image_model_id, prompts_data)
            
        else:
            return self.civitai_ghibli_background_style(image_model_id, prompts_data)

    
    
    # @TODO stablediffusion api 실험을 위해서 해당 모델들을 올려보고 뽑아보자. 2023.07.11
    # @스테이블 api 결제를 진행해야 되고 결제를 진행함과 동시에 모델들을 올려보자.
     
    
    # Manmaru mix SD1.5
    def civitai_manmaru_mix_style(self, image_model_id, user_prompts=None):
        # @TODO 특정 ng, pg 프롬포트랑 같이 보냄
        # 여기서 특정 모델에 prompt를 저장
        positive_prompts = ""
        negative_prompts = ""
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
