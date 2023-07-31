import os
import cv2

class ImageToSketch:
    
    def __init__(self):
        pass
    
    def image_to_sketch(self, image_name=None):
        # 여기서 이미지를 컨버트 할 수 있도록 api를 만들자.
        # 현재 작업 디렉토리를 변경합니다.
        os.chdir("/Users/itstime/children-playground/children-playground-project/ChildrenFrontEnd/src/images")

        # image = cv2.imread(f'{image_name}.png')
        try:
            image = cv2.imread('9315.png')  # loads an image from the specified file
            print(image)
            # convert an image from one color space to another
            grey_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            invert = cv2.bitwise_not(grey_img)  # helps in masking of the image
            # sharp edges in images are smoothed while minimizing too much blurring
            blur = cv2.GaussianBlur(invert, (21, 21), 0)
            invertedblur = cv2.bitwise_not(blur)
            sketch = cv2.divide(grey_img, invertedblur, scale=245.0)

            # 저장할 경로 명시
            cv2.imwrite(f'sketch.png', sketch)  # converted image is saved as mentioned name
    
        except Exception as e:
            print(e)
    
a = ImageToSketch().image_to_sketch()