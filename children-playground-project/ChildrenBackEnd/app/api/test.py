import json
import requests
import io
import base64
from PIL import Image, PngImagePlugin

url = "http://127.0.0.1:7861"

{
    'txt2img': [
        'prompt matrix',
        'prompts from file or textbox',
        'x/y/z plot',
        'extra options'
    ],
    'img2img': [
        'img2img alternative test',
        'loopback',
        'outpainting mk2',
        "poor man's outpainting",
        'prompt matrix',
        'prompts from file or textbox',
        'sd upscale',
        'x/y/z plot',
        'extra options'
    ]
}

response = requests.get(url=f'{url}/sdapi/v1/script-info')
print(response.json())

# for i in r['images']:
#     image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))

#     png_payload = {
#         "image": "data:image/png;base64," + i
#     }
#     response2 = requests.post(url=f'{url}/sdapi/v1/png-info', json=png_payload)

#     pnginfo = PngImagePlugin.PngInfo()
#     pnginfo.add_text("parameters", response2.json().get("info"))
#     image.save('output.png', pnginfo=pnginfo)
# {
#     'f': False,
#     'update_all_extensions': False,
#     'skip_python_version_check': False,
#     'skip_torch_cuda_test': True,
#     'reinstall_xformers': False,
#     'reinstall_torch': False,
#     'update_check': False,
#     'test_server': False,
#     'skip_prepare_environment': False,
#     'skip_install': False,
#     'data_dir': '/Users/itstime/stable-diffusion-webui',
#     'config': '/Users/itstime/stable-diffusion-webui/configs/v1-inference.yaml',
#     'ckpt': '/Users/itstime/stable-diffusion-webui/model.ckpt',
#     'ckpt_dir': None,
#     'vae_dir': None,
#     'gfpgan_dir': './GFPGAN',
#     'gfpgan_model': None,
#     'no_half': False,
#     'no_half_vae': True,
#     'no_progressbar_hiding': False,
#     'max_batch_count': 16,
#     'embeddings_dir': '/Users/itstime/stable-diffusion-webui/embeddings',
#     'textual_inversion_templates_dir': '/Users/itstime/stable-diffusion-webui/textual_inversion_templates',
#     'hypernetwork_dir': '/Users/itstime/stable-diffusion-webui/models/hypernetworks',
#     'localizations_dir': '/Users/itstime/stable-diffusion-webui/localizations',
#     'allow_code': False,
#     'medvram': False,
#     'lowvram': False,
#     'lowram': False,
#     'always_batch_cond_uncond': False,
#     'unload_gfpgan': False,
#     'precision': 'autocast',
#     'upcast_sampling': True,
#     'share': False,
#     'ngrok': None,
#     'ngrok_region': '',
#     'ngrok_options': {},
#     'enable_insecure_extension_access': False,
#     'codeformer_models_path': '/Users/itstime/stable-diffusion-webui/models/Codeformer',
#     'gfpgan_models_path': '/Users/itstime/stable-diffusion-webui/models/GFPGAN',
#     'esrgan_models_path': '/Users/itstime/stable-diffusion-webui/models/ESRGAN',
#     'bsrgan_models_path': '/Users/itstime/stable-diffusion-webui/models/BSRGAN',
#     'realesrgan_models_path': '/Users/itstime/stable-diffusion-webui/models/RealESRGAN',
#     'clip_models_path': None,
#     'xformers': False,
#     'force_enable_xformers': False,
#     'xformers_flash_attention': False,
#     'deepdanbooru': False,
#     'opt_split_attention': False,
#     'opt_sub_quad_attention': False,
#     'sub_quad_q_chunk_size': 1024,
#     'sub_quad_kv_chunk_size': None,
#     'sub_quad_chunk_threshold': None,
#     'opt_split_attention_invokeai': False,
#     'opt_split_attention_v1': False,
#     'opt_sdp_attention': False,
#     'opt_sdp_no_mem_attention': False,
#     'disable_opt_split_attention': False,
#     'disable_nan_check': False,
#     'use_cpu': [
#         'interrogate'
#     ],
#     'listen': False,
#     'port': '7866',
#     'show_negative_prompt': False,
#     'ui_config_file': '/Users/itstime/stable-diffusion-webui/ui-config.json',
#     'hide_ui_dir_config': False,
#     'freeze_settings': False,
#     'ui_settings_file': '/Users/itstime/stable-diffusion-webui/config.json',
#     'gradio_debug': False,
#     'gradio_auth': None,
#     'gradio_auth_path': None,
#     'gradio_img2img_tool': None,
#     'gradio_inpaint_tool': None,
#     'gradio_allowed_path': None,
#     'opt_channelslast': False,
#     'styles_file': '/Users/itstime/stable-diffusion-webui/styles.csv',
#     'autolaunch': False,
#     'theme': None,
#     'use_textbox_seed': False,
#     'disable_console_progressbars': False,
#     'enable_console_prompts': False,
#     'vae_path': None,
#     'disable_safe_unpickle': False,
#     'api': False,
#     'api_auth': None,
#     'api_log': True,
#     'nowebui': True,
#     'ui_debug_mode': False,
#     'device_id': None,
#     'administrator': False,
#     'cors_allow_origins': None,
#     'cors_allow_origins_regex': None,
#     'tls_keyfile': None,
#     'tls_certfile': None,
#     'disable_tls_verify': None,
#     'server_name': None,
#     'gradio_queue': True,
#     'no_gradio_queue': False,
#     'skip_version_check': False,
#     'no_hashing': False,
#     'no_download_sd_model': False,
#     'subpath': None,
#     'add_stop_route': False,
#     'ldsr_models_path': '/Users/itstime/stable-diffusion-webui/models/LDSR',
#     'lora_dir': '/Users/itstime/stable-diffusion-webui/models/Lora',
#     'scunet_models_path': '/Users/itstime/stable-diffusion-webui/models/ScuNET',
#     'swinir_models_path': '/Users/itstime/stable-diffusion-webui/models/SwinIR'
# }