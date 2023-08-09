
/**
 * @TODO Test 해보자.
 */
import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
const demosSection = document.getElementById("demos");
let handLandmarker = undefined;
let runningMode = "video";
let enableWebcamButton;
let webcamRunning = false;

// 손 인식 개수는 1개
const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        // GPU 사용
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
        },
        runningMode: runningMode,
        numHands: 1
    });
};

// 
createHandLandmarker();
/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// Check if webcam access is supported.
const hasGetUserMedia = () => { 
    var _a; 
    return !!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia); 
};

// 웹캠을 가지고 있는지 가지고 있지 않은지를 검사하는거고
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
}
else {
    console.warn("getUserMedia() is not supported by your browser");
}

// 여기서부터가 실제 웹캠이 켜지면서 동작하는 곳.
// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!handLandmarker) {
        console.log("Wait! objectDetector not loaded yet.");
        return;
    }

    // 웹캠 돌아가냐 안돌아가냐에 따라서 텍스트 변경.
    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    }
    else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
    // getUsermedia parameters.
    const constraints = {
        video: true
    };
    // Activate the webcam stream.
    // stream을 받으면 영상 출력.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        // 여기서 캠에서 예측하는게 함수가 실행되고
        // 즉 카메라로부터 stream으로 데이터를 계속 받아오면 predictwebcam에서 인지하고
        // 실행한다.
        video.addEventListener("loadeddata", predictWebcam);
    });
}



let lastVideoTime = -1;
let results = undefined;
// 비동기로 동작하는 함수가 되고
// canvas 에서 한번 살펴봐야 될거 같은데
// 아 canvas를 웹캠 켜지는것과 겹치게 되어서 원래는 손 인식 되는 css는 canvas에 그려진다.
// 하지만 이렇게 카메라의 width ,height로 똑같이 맞추게 되면 그려지는것과 같은 효과를 볼 수 있네.
// 또한 depth를 가지고 있기 때문에 더 커질 수 있다는것.
/// 오케이 준비는 된거같다.
async function predictWebcam() {
    // 요소 자체를 video의 크기로 설정하는데
    // 음
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    // 1920 , 1080
    // console.log(canvasElement.width);
    // console.log(canvasElement.height);
    // Now let's start detecting the stream.
    // 시작 시간을 체크
    let startTimeMs = performance.now();
    // 마지막시간이 현재 시작한 시간이 아니라면
    if (lastVideoTime !== video.currentTime) {
        // 마지막으로 비디오를 실행한 시점을 현재 시점으로 바꿔준다.
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, startTimeMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.landmarks) {
        for (const landmarks of results.landmarks) {
            // 라인
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: "white",
                lineWidth: 2
            });
            // 서클
            drawLandmarks(canvasCtx, landmarks, { color: "cyan", lineWidth: 2 });
        }
    }
    canvasCtx.restore();
    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}