# StableChildren (AI program for children)
## Introduce 👋
"Hello! Welcome to my 'StableChildren' repository, dedicated to children. Nowadays, the way we think is incredibly important. Consequently, I've been contemplating what programs could enhance children's thinking processes.

I aspire for children to broaden their thinking through art. Regardless of whether it's a complex or simple problem, we tend to imagine it. Similarly, when we read books, our imagination comes into play. For instance, exploring 'Kongjwi and Patjwi,' a traditional Korean romance story from the Joseon Dynasty, prompts children to ponder, 'What is that?' or 'I wonder about that word.' Subsequently, when a teacher provides an explanation, children acquire new knowledge.

Everything I've mentioned so far revolves around 'the curiosity children possess.' Through such curiosity, they associate various thoughts and engage in imaginative thinking, thereby fostering creativity and learning how to think critically. Consequently, I've decided to create the 'StableChildren' program to contribute, even if just a bit, to this process."

## Features
- Through gesture recognition, children move words or sentences themselves by using their hands.
- Choice one of two paintings style.
- Teacher watches paintings first when received paintings. therefore children can't see anything until teacher is confirmed.

## Tech
- **Mediapipe gesture recognition**
- **Stablediffusion webui(automatic1111)*
- Django v4.2.2
- Python v3.10.1
- Vanila javascript, html, css
- Google colab pro for generate image by using GPU.
- **Used localStorage.**
- anime js opensource library (thank you for your dedication).
- Toastify opensource library (thank you for your dedication).

## Architecture
![Children-playground-flow-image](https://github.com/ITSTIME1/children-playground/assets/88642524/e1a0b53a-9930-4191-9b42-f3e24d1c2225)
## Installation
```sh
pip install -r requirements.txt
cd (your download path)
python manage.py runserver(local)
```
**[Important]** you have to had 'Google colab pro' or your GPU (**CPU is not recommended for your image. its very slow..**)<br>
**[Important]** you have a 'web cam' for recognize hand if you don't want that's fine.

## How to use (Very Important)
- First run server and into http://localhost:8000/child/childPage/ (**This is main page for children**)

- Second you must host into http://localhost:8000/manager/managePage/ (**This is manage page for teacher (or admin)**)
- Third you must put translate api key for 'papago api'
- Fourth you must put google colab server url to stablediffusion_auto_1111.py and then your custom model or anything model put into models.
- When you finish reading books with children. The teacher types with the children what words or senetences come to mind. and then teahcer can decide. Whether to do it with a mouse or if the children will make their own gesture and move the words.
- When you Finish above process. 'bulb button' press and choice image style. and then again 'bulb button' **After this process children can see 'loading page' and teacher was received four images first.**
- Teacher must decide the image for children. The purpose of this process is to regenerate images that are sensational or have strange joints.
- **If you intentionally enter a word related to an adult, it will automatically detect it and receive a black image. this means that It rarely comes out if you don't type if intentionally. Approximately 80 to 90% of then are blocked, and the teacher checks them first, so they go through the filter again. Also, since the criterion of sensationalism is subjective, you can decide whether to regenerate or not.**
- Feel free enjoy my program :)

## Screenshots
MainPage
- If you decide to use a mouse, you can see the original mouse cursor and if not, you can see the mouse image cursor.<br>
![ezgif com-video-to-gif](https://github.com/ITSTIME1/children-playground/assets/88642524/d895646e-e37e-4676-90aa-0fd3126b7912) 

LoadingPage
- If you don't agree anything, children can't see generating images. so children can see this loading page until you agreed.<br>
![ezgif com-video-to-gif](https://github.com/ITSTIME1/children-playground/assets/88642524/2c870d48-d034-4cbd-a8fc-43ecae8c003c)

ManagePage
- Here, you select regenerate images or you can agree all images.<br>
  <img src="https://github.com/ITSTIME1/children-playground/assets/88642524/ac70b967-44b9-4d60-a72d-9a3234a15c61" width="600" height="320">

Mediapipe Gesture Recognition
- This is mediapipe gesture recognition. If your current gesture is not "ClosedFist", you can dargging and drop if not<br>
  dragging will be false and target will be initialized.<br>
  <img src="https://github.com/ITSTIME1/StableChildren/assets/88642524/48591f6d-2758-4cdb-ae7a-3d1f2b19ad74" width="300" height="320">
  
## License
MIT License

Copyright (c) 2023 ITSTIME

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
