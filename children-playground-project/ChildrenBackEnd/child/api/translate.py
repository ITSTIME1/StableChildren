import json
import urllib.request

'''
    papago translate api
'''
class TransLate():
    def __init__(self):
        self._endPoint = "https://openapi.naver.com/v1/papago/n2mt"
        self._apiKey = ""
        self._source = "ko"
        self._target = "en"
        self._data =  "source=ko&target=en&text="
        self._clientID = "[your papago client id]"
        self._secretKey = "[your secretkey]"
        
    
    def translator(self, prompt):
        try:
            request = urllib.request.Request(self._endPoint)
            request.add_header("X-Naver-Client-Id", self._clientID)
            request.add_header("X-Naver-Client-Secret", self._secretKey)
            encText = urllib.parse.quote(", ".join(prompt))
            self._data += encText
            response = urllib.request.urlopen(request, data=self._data.encode("utf-8"))
            
            if response.status == 200:
                response_body = response.read().decode("utf-8")
                data_dict = json.loads(response_body)
                translated_text = data_dict["message"]["result"]["translatedText"].split(",")
                translated_text = [word.strip() for word in translated_text]
                return translated_text
        except Exception as e:
            return e
