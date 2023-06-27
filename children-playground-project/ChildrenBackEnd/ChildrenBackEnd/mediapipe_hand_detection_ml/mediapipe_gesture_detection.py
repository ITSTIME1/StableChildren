import cv2
import mediapipe as mp
import pyautogui
import tensorflow as tf
from tensorflow.python.client import device_lib


# global variable
cap = None
screen_width, screen_height = pyautogui.size()
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
mp_drawing_styles = mp.solutions.drawing_styles

# finger states
finger_state = {0: False,
                1: False,
                2: False,
                3: False,
                4: False}

# program initialize
def initialize():
    global cap
    # For webcam input:
    cap = cv2.VideoCapture(0)
    # corner로 가는걸 방지
    pyautogui.FAILSAFE = False

    print(f"pyautoGUI : {screen_width}, {screen_height}")   
    print(tf.__version__)

    print(device_lib.list_local_devices())
    print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))

# finger state initialize
def finger_state_initialize():
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

    if finger_state[0] and finger_state[1] and finger_state[2] and finger_state[3]:
        print("손가락 펴짐")

        # 6,10,14, 18
        # (not finger_state[1] and not finger_state[2] and not finger_state[3] and not finger_state[4])
        # 4개의 끝 마디가 아래 4개의 마디보다 커지는 경우이면서 and 엄지가 4마디보다 커질때
        # 여기서 image_height는 컬러작업후에 변경된 이미지의 크기를 가지고온다.
        cx = (
            hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP].x * screen_width)
        cy = (
            hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_MCP].y * screen_height)

        print(f"{cx}, {cy}")
        # cx, cy값을 viewport의 화면 크기에 상대좌표로 바꿔야하니까
        pyautogui.moveTo(cx, cy)

        mp_drawing.draw_landmarks(
            image,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS,
            mp_drawing.DrawingSpec(
                color=(255, 191, 0), thickness=2, circle_radius=3),
            mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=1, circle_radius=2))
    # (THUMB_TIP > INDEX_PIP) and (THUMB_TIP > MIDDLE_PIP)
    #       and (THUMB_TIP > RING_PIP)
    #       and (THUMB_TIP > PINKY_PIP) and
    elif ((INDEX_TIP > INDEX_MCP and MIDDLE_TIP > MIDDLE_MCP and RING_TIP > RING_MCP and PINKY_TIP > PINKY_MCP)):
        # BGR
        mp_drawing.draw_landmarks(
            image,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS,
            mp_drawing.DrawingSpec(
                color=(255, 191, 0), thickness=2, circle_radius=3),
            mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=1, circle_radius=2))
        print(f"주먹쥠")
    else:
        mp_drawing.draw_landmarks(
            image,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS,
            mp_drawing.DrawingSpec(
                color=(255, 191, 0), thickness=2, circle_radius=3),
            mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=1, circle_radius=2))


with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.8) as hands:
    initialize()
    while cap.isOpened():
        success, image = cap.read()

        h, w, c = image.shape
     
        if not success:
            print("Ignoring empty camera frame.")
            continue
        
        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)

        image.flags.writeable = False
        results = hands.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        image_height, image_width, _ = image.shape

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # finger_state 초기화
                finger_state_initialize()
                # image 출력
                cv2.imshow('MediaPipe Hands', image)

        if cv2.waitKey(5) & 0xFF == 27:
            break

cap.release()
