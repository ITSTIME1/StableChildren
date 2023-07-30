from django.shortcuts import render
from django.http import HttpResponse 
from django.http import JsonResponse as json
from .api.image_style_model import ImageStyleModel as GenerateImage
import json


def get_image(request):
    if request.method == "POST":
        client_ip = request.META['HTTP_REFERER']
        # @body = 바이트 객체를 json으로 변환 후 디코드해서 데이터를 유니코드화.
        # @request_body = json 객체로 변환된 데이터 중 'params' 데이터에 접근.
        body = json.loads(request.body.decode("utf-8"))
        request_body = body['params']

        
        # @image_model_id = 이미지 모델을 파싱해서 저장.
        # @prompts_data =  이중 리스트로 오기 때문에 [0]요소 접근(모든데이터)
        image_model_id = request_body["image_model"]
        prompts_data = request_body["prompt"][0] 
        
        print(image_model_id, prompts_data)
        # 이미지 모델 id 가 none?
        result = GenerateImage().search_model(image_model_id=image_model_id, prompts_data=prompts_data)
        
        parsing_path = f'{client_ip}children-playground-project/ChildrenFrontEnd/src/generatedImages/{result}'
        return HttpResponse(parsing_path)
    else:
        return HttpResponse("Post Test Success")


# {
#     'TERM_SESSION_ID': 'w0t0p0:6C05B884-6406-4C75-9A2A-D75981AA5761',
#     'SSH_AUTH_SOCK': '/private/tmp/com.apple.launchd.ptKiei1J3u/Listeners',
#     'LC_TERMINAL_VERSION': '3.4.19',
#     'COLORFGBG': '15;0',
#     'ITERM_PROFILE': 'Default',
#     'XPC_FLAGS': '0x0',
#     'PWD': '/Users/itstime/children-playground/children-playground-project/ChildrenBackEnd',
#     'SHELL': '/bin/zsh',
#     '__CFBundleIdentifier': 'com.googlecode.iterm2',
#     'TERM_PROGRAM_VERSION': '3.4.19',
#     'TERM_PROGRAM': 'iTerm.app',
#     'PATH': '/Users/itstime/children-playground/children-playground-project/childrenVenv/bin:/Users/itstime/miniforge3/bin:/Users/itstime/.pyenv/shims:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/X11/bin:/Library/Apple/usr/bin',
#     'DISPLAY': '/private/tmp/com.apple.launchd.Vszin5mJY3/org.xquartz:0',
#     'LC_TERMINAL': 'iTerm2',
#     'COLORTERM': 'truecolor',
#     'COMMAND_MODE': 'unix2003',
#     'TERM': 'xterm-256color',
#     'HOME': '/Users/itstime',
#     'TMPDIR': '/var/folders/pl/wwx6fs4d3fdcy0wf1dvsg3100000gn/T/',
#     'USER': 'itstime',
#     'XPC_SERVICE_NAME': '0',
#     'LOGNAME': 'itstime',
#     'ITERM_SESSION_ID': 'w0t0p0:6C05B884-6406-4C75-9A2A-D75981AA5761',
#     '__CF_USER_TEXT_ENCODING': '0x1F5:0x0:0x0',
#     'SHLVL': '1',
#     'OLDPWD': '/Users/itstime/children-playground/children-playground-project',
#     'HOMEBREW_PREFIX': '/opt/homebrew',
#     'HOMEBREW_CELLAR': '/opt/homebrew/Cellar',
#     'HOMEBREW_REPOSITORY': '/opt/homebrew',
#     'MANPATH': '/opt/homebrew/share/man::',
#     'INFOPATH': '/opt/homebrew/share/info:',
#     'ZSH': '/Users/itstime/.oh-my-zsh',
#     'PAGER': 'less',
#     'LESS': '-R',
#     'LSCOLORS': 'Gxfxcxdxbxegedabagacad',
#     'LS_COLORS': 'di=1;36:ln=35:so=32:pi=33:ex=31:bd=34;46:cd=34;43:su=30;41:sg=30;46:tw=30;42:ow=30;43',
#     'LC_CTYPE': 'UTF-8',
#     'PYENV_SHELL': 'zsh',
#     'VIRTUAL_ENV': '/Users/itstime/children-playground/children-playground-project/childrenVenv',
#     'PS1': '(childrenVenv) %{%f%b%k%}$(build_prompt) ',
#     'VIRTUAL_ENV_PROMPT': '(childrenVenv) ',
#     '_': '/Users/itstime/children-playground/children-playground-project/childrenVenv/bin/python',
#     'DJANGO_SETTINGS_MODULE': 'ChildrenBackEnd.settings',
#     'TZ': 'UTC',
#     'RUN_MAIN': 'true',
#     'SERVER_NAME': '1.0.0.127.in-addr.arpa',
#     'GATEWAY_INTERFACE': 'CGI/1.1',
#     'SERVER_PORT': '8000',
#     'REMOTE_HOST': '',
#     'CONTENT_LENGTH': '129',
#     'SCRIPT_NAME': '',
#     'SERVER_PROTOCOL': 'HTTP/1.1',
#     'SERVER_SOFTWARE': 'WSGIServer/0.2',
#     'REQUEST_METHOD': 'POST',
#     'PATH_INFO': '/getImage/',
#     'QUERY_STRING': '',
#     'REMOTE_ADDR': '127.0.0.1',
#     'CONTENT_TYPE': 'application/json',
#     'HTTP_HOST': '127.0.0.1:8000',
#     'HTTP_CONNECTION': 'keep-alive',
#     'HTTP_SEC_CH_UA': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
#     'HTTP_ACCEPT': 'application/json, text/plain, */*',
#     'HTTP_SEC_CH_UA_MOBILE': '?0',
#     'HTTP_USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
#     'HTTP_SEC_CH_UA_PLATFORM': '"macOS"',
#     'HTTP_ORIGIN': 'http://127.0.0.1:5500',
#     'HTTP_SEC_FETCH_SITE': 'same-site',
#     'HTTP_SEC_FETCH_MODE': 'cors',
#     'HTTP_SEC_FETCH_DEST': 'empty',
#     'HTTP_REFERER': 'http://127.0.0.1:5500/',
#     'HTTP_ACCEPT_ENCODING': 'gzip, deflate, br',
#     'HTTP_ACCEPT_LANGUAGE': 'ko,en-US;q=0.9,en;q=0.8',
#     'wsgi.input': <django.core.handlers.wsgi.LimitedStreamobjectat0x104cebc70>,
#     'wsgi.errors': <_io.TextIOWrappername='<stderr>'mode='w'encoding='utf-8'>,
#     'wsgi.version': (
#         1,
#         0
#     ),
#     'wsgi.run_once': False,
#     'wsgi.url_scheme': 'http',
#     'wsgi.multithread': True,
#     'wsgi.multiprocess': False,
#     'wsgi.file_wrapper': <class'wsgiref.util.FileWrapper'>
# }