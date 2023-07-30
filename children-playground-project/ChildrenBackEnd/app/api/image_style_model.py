from .stablediffusion_auto_1111 import StableDiffusionAuto1111
from ..constants.constant import Constant

class ImageStyleModel:
    # image_model_id를 받아서 함수 실행
    def __init__(self):
        self.stablediffusion = StableDiffusionAuto1111()
        self.constant = Constant()
        pass

    def search_model(self, image_model_id=None, prompts_data=None):
        # image_model_id가 None인경우.
        if image_model_id is None:
            return "올바르지 못한 데이터입니다."

        if image_model_id == "Manmaru":
            return self.civitai_manmaru_mix_style(image_model_id, prompts_data)

        elif image_model_id == "Anime":
            return self.civitai_anime_style(image_model_id, prompts_data)
    

    # Manmaru mix SD1.5
    def civitai_manmaru_mix_style(self, image_model_id=None, user_prompts=None):
        # manMaru + brighter-eye1 + orangeMix 가 잘듣는거 같은데 더 깔끔해
        # option_payload = {
        #     "sd_model_checkpoint": "manMaru.safetensors [aeb953ac1a]",
        #     "CLIP_stop_at_last_layers": 2,
        #     "sd_lora": "brighter-eye1",
        #     "sd_vae" : "orangemix.vae.pt",
        # }
        
        
        # self._payload = {
        #     "restore_faces": True,
        #     "prompt": "<lora:brighter-eye1:1>, [], masterpiece, best quality, high quality",
        #     "negative_prompt": "ugly, lowres, (bad fingers:1.2), (bad anatomy:1.1), bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, nsfw",
        #     "batch_size": 1,
        #     "steps": 22,
        #     "cfg_scale": 11,
        #     "width": 512,
        #     "height": 768,
        #     "sampler_index": "DPM++ 2M"
        # }
        positive_prompts = f'<lora:brighter-eye1:1>, {", ".join(user_prompts)}, smile, low angle, masterpiece, best quality'
        negative_prompts = f'(lowres), (bad anatomy:1.2), (bad hands), text, error, (missing fingers), extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, ((nsfw)), bad fingers'
        # result가 받게 되는 값은 생성된 이미지 이름을 받으면 되겠다
        generated_image = None
        

        try:
            change_model = self.stablediffusion.change_model(loRa="brighter-eye1", 
                                                         model="manMaru.safetensors [aeb953ac1a]", 
                                                         vae="orangemix.vae.pt")
        except Exception as e:
            print(e)
    
        # 모델이 정상적으로 수신 되었기 때문에 이미지를 생성한다.
        if change_model == 200:
            
            # 이미지 생성 완료 -> client 보내줌 
            # -> 이미지가 도착했다면 이미지를 보러 갈건지 요청하는 문구를 띄움.
            # -> 확인을 누르면 새로고침(imagePath 글로벌 변수에 저장).
            # -> fourImageSection 에 이미지 파일 영역을 교체.
            # -> hover 했을때 보이도록
            generated_image = self.stablediffusion.get_image(image_model_id = image_model_id, 
                                                             prompt = positive_prompts, 
                                                             negative_prompt = negative_prompts)
            # 이미지는 여기서 받아오니까
        else:
            return "Sorry Response Code is 422"
        
        # 이미지 path를 보냐주자
        if generated_image is not None:
            # path를 넘겨주게 되고
            print(generated_image)
            return generated_image
    
    
    # anime model
    # 동물, 풍경 실사화 모델
    def civitai_anime_style(self, image_model_id=None, user_prompts=None):
        # 동물을 진짜 잘뽑음, 인간도 잘뽑는데 뽑지 않는걸 추천
        # 동물, 풍경
        # anime + vae(orange mix)
        # 이 스타일로 가는게 제일 베스트
        # option_payload = {
        #     "sd_model_checkpoint": "anime.safetensors",
        #     "CLIP_stop_at_last_layers": 2,
        #     "sd_lora": "None",
        #     "sd_vae" : "orangemix.vae.pt",
        # }
        
        # 프롬포트
        # self._payload = {
        #     "restore_faces": True,
        #     "prompt": "(digital painting), (best quality), pond, flowers, house, cloud, Ukiyo-e art style, Hokusai inspiration, Deviant Art popular, 8k ultra-realistic, pastel color scheme, soft lighting, golden hour, tranquil atmosphere, landscape orientation",
        #     "negative_prompt": "(worst quality:1.2), (low quality:1.2), (lowres:1.1), (monochrome:1.1), (greyscale), multiple views, comic, sketch, (((bad anatomy))), (((deformed))), (((disfigured))), watermark, multiple_views, mutation hands, mutation fingers, extra fingers, missing fingers, watermark, nsfw",
        #     "batch_size": 1,
        #     "steps": 30,
        #     "cfg_scale": 8.5,
        #     "width": 512,
        #     "height": 768,
        #     "sampler_index": "DPM++ 2M"
        # }
        pass
    
    # 오늘 새벽에 구현하는 걸로 하자.
    # @TODO api 만들고 그림 path client한테주자
    # @TODO client에서 받아서 이미지 경로를 slider에 주자
    