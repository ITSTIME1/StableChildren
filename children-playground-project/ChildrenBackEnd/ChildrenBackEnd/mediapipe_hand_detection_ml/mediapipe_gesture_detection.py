import cv2
import mediapipe as mp
from PIL import ImageFont, ImageDraw, Image
import numpy as np
import pyautogui

import tensorflow as tf
from tensorflow.python.client import device_lib
print(tf.__version__)

print(device_lib.list_local_devices())
print("Num GPUs Available: ", len(
    tf.config.experimental.list_physical_devices('GPU')))

mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
mp_drawing_styles = mp.solutions.drawing_styles


screen_width, screen_height = pyautogui.size()

print(f"pyautoGUI : {screen_width}, {screen_height}")

pre = ''
offset = 150

# fingers
# WRIST = 0
# THUMB_CMC = 1
# THUMB_MCP = 2
# THUMB_IP = 3
# THUMB_TIP = 4    # 엄지

# INDEX_FINGER_MCP = 5
# INDEX_FINGER_PIP = 6
# INDEX_FINGER_DIP = 7
# INDEX_FINGER_TIP = 8  # 검지

# MIDDLE_FINGER_MCP = 9
# MIDDLE_FINGER_PIP = 10
# MIDDLE_FINGER_DIP = 11
# MIDDLE_FINGER_TIP = 12  #중지

# RING_FINGER_MCP = 13
# RING_FINGER_PIP = 14
# RING_FINGER_DIP = 15
# RING_FINGER_TIP = 16  #약지

# PINKY_MCP = 17
# PINKY_PIP = 18
# PINKY_DIP = 19
# PINKY_TIP = 20  #새끼

# For webcam input:
cap = cv2.VideoCapture(0)

# thumb_finger = False
# index_finger = False
# middle_finger = False
# ring_finger = False
# pinky_finger = False

# finger states
finger_state = {0: False,
                1: False,
                2: False,
                3: False,
                4: False}

with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.8) as hands:

    while cap.isOpened():
        success, image = cap.read()

        h, w, c = image.shape

        if not success:
            print("Ignoring empty camera frame.")

            # If loading a video, use 'break' instead of 'continue'.
            continue

        # Flip the image horizontally for a later selfie-view display, and convert
        # the BGR image to RGB.
        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)

        # To improve performance, optionally mark the image as not writeable to
        # pass by reference.
        image.flags.writeable = False
        results = hands.process(image)

        # screen_height : y_ = image_height : y
        # y_ = y*screen_height/image_height

        # Draw the hand annotations on the image.
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        image_height, image_width, _ = image.shape
        # print(f"이미지 : {image_width}, {image_height}")

        # gesture recoginition

        # 1. 다섯손가락이 전부 펼쳐져 있을때는 마우스를 이동 시킨다.
        # 2. 엄지를 제외하고, 나머지 네 손가락의 가장 위에 있는 손가락의 끝이 빨간 고관절의 y좌표보다 크거나 같아진다면 움켜지는걸 true하고
        # && 엄지는 네 손가락의 첫번째 관절값들보다 엄지의 맨 끝의 좌표가 더 크다면 움켜쥔걸로 판단

        # 3. 움켜쥐었을때

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # 손가락 상태 확인
                # finger_state(hand_landmarks, image_height)
                # 엄지(오름차순)
                THUMB_CMC = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_CMC].y * image_height
                THUMB_MCP = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_MCP].y * image_height
                THUMB_IP = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_IP].y * image_height
                THUMB_TIP = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP].y * image_height

                # 검지(오름차순)
                INDEX_MCP = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_MCP].y * image_height
                INDEX_PIP = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_PIP].y * image_height
                INDEX_DIP = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_DIP].y * image_height
                INDEX_TIP = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].y * image_height

                # 중지(오름차순)
                MIDDLE_MCP = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP].y * image_height
                MIDDLE_PIP = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_PIP].y * image_height
                MIDDLE_DIP = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_DIP].y * image_height
                MIDDLE_TIP = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_TIP].y * image_height
                # 약지(오름차순)
                RING_MCP = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_MCP].y * image_height
                RING_PIP = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_PIP].y * image_height
                RING_DIP = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_DIP].y * image_height
                RING_TIP = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_TIP].y * image_height

                # 새끼(오름차순)
                PINKY_MCP = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_MCP].y * image_height
                PINKY_PIP = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_PIP].y * image_height
                PINKY_DIP = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_DIP].y * image_height
                PINKY_TIP = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP].y * image_height

                if THUMB_CMC >= THUMB_MCP and THUMB_MCP >= THUMB_IP and THUMB_IP >= THUMB_TIP:
                    finger_state[0] = True
                else:
                    finger_state[0] = False

                if INDEX_MCP >= INDEX_PIP and INDEX_PIP >= INDEX_DIP and INDEX_DIP >= INDEX_TIP:
                    finger_state[1] = True
                else:
                    finger_state[1] = False

                if MIDDLE_MCP >= MIDDLE_PIP and MIDDLE_PIP >= MIDDLE_DIP and MIDDLE_DIP >= MIDDLE_TIP:
                    finger_state[2] = True
                else:
                    finger_state[2] = False

                if RING_MCP >= RING_PIP and RING_PIP >= RING_DIP and RING_DIP >= RING_TIP:
                    finger_state[3] = True
                else:
                    finger_state[3] = False

                if PINKY_MCP >= PINKY_PIP and PINKY_PIP >= PINKY_DIP and PINKY_DIP >= PINKY_TIP:
                    finger_state[4] = True
                else:
                    finger_state[4] = False
                # 모두 true라면 손가락이 펴져 있는 것이므로
                # 손가락펴짐 출력
                if finger_state[0] and finger_state[1] and finger_state[2] and finger_state[3]:
                    print("손가락 펴짐")
                    # 마우스가 움직여야 되고
                    # 그 움직임에 대한 x, y좌표를 얻어야하는데
                    # 범위 자체는 나중에정해주고

                    # 관절 두번째랑 wrist 와의 차이를 구하면되겠다.
                    # gui가 image 사이즈가 아니네
                    
                    # wrist_x 좌표
                    # wrist_y 좌표
                    
                    image_x = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].x*image_width
                    image_y = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].y*image_height 

                    if image_x > offset and image_x < w-offset and image_y > offset and image_y < h - offset:
                      image_x = image_x - offset
                      image_y = image_y - offset
                      
                      # 손 박스의 좌표
                      new_image_height = image_height - offset*2
                      new_image_width = image_width - offset*2

                      screen_y = image_y*screen_height/new_image_height
                      screen_x = image_x*screen_width/new_image_width

                      pyautogui.moveTo(screen_x, screen_y)
                else:
                    print(f"손가락 다 안펴짐")
                    pyautogui.mouseUp()

                mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS, mp_drawing_styles.get_default_hand_landmarks_style(
                ), mp_drawing_styles.get_default_hand_connections_style())

                # image 출력
                cv2.imshow('MediaPipe Hands', image)

        if cv2.waitKey(5) & 0xFF == 27:
            break

cap.release()


def finger_state(hand_landmarks, image_height):
    global finger_state
    print("H")
    # 엄지(오름차순)
    THUMB_CMC = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_CMC].y * image_height
    THUMB_MCP = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_MCP].y * image_height
    THUMB_IP = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_IP].y * image_height
    THUMB_TIP = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP].y * image_height

    # 검지(오름차순)
    INDEX_MCP = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_MCP].y * image_height
    INDEX_PIP = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_PIP].y * image_height
    INDEX_DIP = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_DIP].y * image_height
    INDEX_TIP = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].y * image_height

    # 중지(오름차순)
    MIDDLE_MCP = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP].y * image_height
    MIDDLE_PIP = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_PIP].y * image_height
    MIDDLE_DIP = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_DIP].y * image_height
    MIDDLE_TIP = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_TIP].y * image_height
    # 약지(오름차순)
    RING_MCP = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_MCP].y * image_height
    RING_PIP = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_PIP].y * image_height
    RING_DIP = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_DIP].y * image_height
    RING_TIP = hand_landmarks.landmark[mp_hands.HandLandmark.RING_FINGER_TIP].y * image_height

    # 새끼(오름차순)
    PINKY_MCP = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_MCP].y * image_height
    PINKY_PIP = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_PIP].y * image_height
    PINKY_DIP = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_DIP].y * image_height
    PINKY_TIP = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP].y * image_height

    if THUMB_CMC >= THUMB_MCP and THUMB_MCP >= THUMB_IP and THUMB_IP >= THUMB_TIP:
        finger_state[0] = True
    else:
        finger_state[0] = False

    if INDEX_MCP >= INDEX_PIP and INDEX_PIP >= INDEX_DIP and INDEX_DIP >= INDEX_TIP:
        finger_state[1] = True
    else:
        finger_state[1] = False

    if MIDDLE_MCP >= MIDDLE_PIP and MIDDLE_PIP >= MIDDLE_DIP and MIDDLE_DIP >= MIDDLE_TIP:
        finger_state[2] = True
    else:
        finger_state[2] = False

    if RING_MCP >= RING_PIP and RING_PIP >= RING_DIP and RING_DIP >= RING_TIP:
        finger_state[3] = True
    else:
        finger_state[3] = False

    if PINKY_MCP >= PINKY_PIP and PINKY_PIP >= PINKY_DIP and PINKY_DIP >= PINKY_TIP:
        finger_state[4] = True
    else:
        finger_state[4] = False
