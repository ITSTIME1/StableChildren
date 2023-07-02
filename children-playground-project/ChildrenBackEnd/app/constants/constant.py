"""
"""
class Constant:
    # stablediffusion api key return
    # 읽기 전용으로 만든다.
    def __init__(self):
        self._API_KEY = "api_key"
    
    @property
    def get_key(self):
        return self._API_KEY