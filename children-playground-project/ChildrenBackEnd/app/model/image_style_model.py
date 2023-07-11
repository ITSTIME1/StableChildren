from ..api.stablediffusion_community_model import StableDiffusionCommunityModel


class ImageStyleModel:
    # image_model_id를 받아서 함수 실행
    def __init__(self):
        self.stablediffusion = StableDiffusionCommunityModel()
        pass
    
    def search_model(self, image_model_id=None, prompts_data = None):
        if image_model_id == None:
            return "올바르지 못한 데이터입니다."

        if image_model_id == "1":
            # 따라서 우선적으로 image_model_id를 검사하고
            # 해당 image_model_id에 해당하는 부정프롬포트나 긍정 프롬포트 같은것을 같이 넘겨준다.
            # 따라서 prompts, model_id, negative_prompts, positive_prompts를 넘겨준다.
            # 그걸 get1(), get2() 라는 함수에서 stablediffusion 쪽에 넘겨주고
            # 그렇게 넘겨준다면 베이스 프롬포트가 섞일 일도 없고, 어떤 모델 Id에 어떤 프롬포트가 필요한지를 구분해서
            # 볼 수 있기 때문에 한번에 stablediffusion에서 처리하는 것 보다 효율적이다.
            
            
            # @TODO
            # 그럼 이제 모델을 좀 선별을 해봐야 하는데 좀 테스트를 해서 괜찮은 모델을 좀 선정해보자
            # 4개 정도의 모델을 사용하는게 어떨까 싶은데
            # 우선 베타 테스트 정도는 4개 모델로 만들어주고
            # 이후에 추가적으로 개발하게 되면 학습 모델을 추가하는 방법으로 진행하는게 좋을거 같음
            
            return self.civitai_fairy_style(image_model_id)
        elif image_model_id == "2":
            return self.get2()
            
    # 여기에다가 이미지 모델들을 정의해두고
    def civitai_fairy_style(self, image_model_id):
        # @TODO 특정 ng, pg 프롬포트랑 같이 보냄
        # 여기서 특정 모델에 prompt를 저장
        return self.stablediffusion.get_image(image_model_id)
        
    
    def get2(self):
        return print("2")