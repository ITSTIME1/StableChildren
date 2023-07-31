"""
"""
class Constant:
    # stablediffusion api key return
    # 읽기 전용으로 만든다.
    def __init__(self):
        # 나중에 환경에다가 저장해놓고 사용하는게 좋겠음.
        self._API_KEY = "FrHpoKMq81lJlZzE4uSHGQlXy59ZumQADglFxOoPZq85H2ZDZo4VjtO6dxs4"        
        
    @property
    def get_key(self):
        return self._API_KEY
    
