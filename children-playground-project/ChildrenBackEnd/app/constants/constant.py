"""
"""
class Constant:
    # stablediffusion api key return
    # 읽기 전용으로 만든다.
    def __init__(self):
        # 나중에 환경에다가 저장해놓고 사용하는게 좋겠음.
        self._API_KEY = "FrHpoKMq81lJlZzE4uSHGQlXy59ZumQADglFxOoPZq85H2ZDZo4VjtO6dxs4"
        self._man_maru_mix_positive = f'masterpiece, best quality, landscape'
        self._man_maru_mix_negative = f'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry'
        # 맨마루 모델 말고도 다른 프롬포트도 상수화 시키면 됨
        
        
    @property
    def get_key(self):
        return self._API_KEY
    

    @property
    def get_man_maru_positve(self):
        return self._man_maru_mix_positive
    
    
    @property
    def get_man_maru_negative(self):
        return self._man_maru_mix_negative