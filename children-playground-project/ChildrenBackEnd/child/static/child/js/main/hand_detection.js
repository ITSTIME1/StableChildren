import {
  FilesetResolver,
  GestureRecognizer,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

/** [MediaPipe]
 * 
 * @video = 웹캠 변수.
 * @gestureRecognizer = 손 인식을 준비하기 위한 변수.
 * @runningMode = 비디오로부터 프레임 단위로 읽어오기 위해 실행할 종류를 명시.
 * @enableWebcamButton = 웹캠 버튼을 허용하여 제스처 인식 시작.
 * @constraints = getUserMedia로부터 전달되는 변수.
 */
const video = document.getElementById("webcam");
let gestureRecognizer = undefined;
let runningMode = "video";
let enableWebcamButton;
let webcamRunning = false;
let constraints = { video: true };


/** [MediaPipe]
 * 
 * @cursor = 제스처 인식을 위한 '마우스 이미지'
 * @ax , @ay = 마우스 이미지의 상대좌표를 저장하기 위한 변수.
 * @centerX , @centerY = 애니메이션 화면의 중앙 값 이후 마우스 이미지의 초기 좌표로 활용.
 * @mouseX , @mouseY = 제스처 인식을 하지 않을때 마우스의 좌표를 저장하기 위한 변수.
 * @wordTarget = 선택되어진 단어를 저장하는 변수.
 * @wordTargetPosition = 선택되어진 단어가 리스트에서 어떤 위치에 있는지를 기억하기 위한 변수.
 * @startPosX , @startPosY = 단어가 선택되어졌을때 마우스가 눌린 위치로부터 선택된 단어가 떨어진 거리를 측정하기 위한 변수.
 * @isDragging = 선택되어진 단어를 드래그 하고 있는지를 감시하는 변수.
 * @circleCoordinate = 단어 애니메이션들의 좌표값들을 저장하는 변수.
 */

let cursor = document.getElementById("mouseCursor");
let aX =0, aY = 0, centerX = 0, centerY = 0, mouseX = 0, mouseY = 0;
let wordTarget = null, startPosX = null, startPosY = null;
let isDragging = false;
let circleCoordinate = [];
let wordTargetPosition = null;



/** [Animation]
 * 
 * @animationContent = 애니메이션 영역 변수.
 * @checkWord = 추가한 단어들을 확인하기 위한 변수.
 * @bulb = 다음 페이지로 넘어가기 위한 변수.
 * @circles = 캠이 켜졌을때 최종적인 단어 애니메이션의 좌표값들을 알기 위한 변수.
 * @prompt = 추가한 단어 목록.
 */

const animationContent = document.querySelector(".hand-animation-content");
const animationRect = animationContent.getBoundingClientRect();
const checkWord = document.querySelector(".third-content");
const bulb = document.getElementById("bulb");
let circles = null;
let wordList = null;
let prompt = [];


// 로컬 스토리지 저장된 단어를 가져옴.
if (localStorage.getItem("wordList")) {
  wordList = JSON.parse(localStorage.getItem("wordList"));
}

polarBear3D();
circleSection();

// 제스처 인식
const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: runningMode,
  });
};
createGestureRecognizer();

// const canvasElement = document.getElementById("output_canvas");
// const canvasCtx = canvasElement.getContext("2d");


// 웹캠을 사용할 수 있는지 체크.
const hasGetUserMedia = () => {
  var _a;
  return !!((_a = navigator.mediaDevices) === null || _a === void 0
    ? void 0
    : _a.getUserMedia);
};


// 웹캠을 사용할 수 있을때 웹캠 활성화.
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}


// 웹캠 버튼 클릭시 실행.
function enableCam() {
  if (!gestureRecognizer) {
    setTimeout(() => {
      Toastify({
        text: "아직 준비중 입니다!",
        duration: 3000,
        newWindow: false,
        close: true,
        gravity: "top", 
        position: "center", 
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #DB9393, #F0CACA)",
        },
      }).showToast();
    }, 1000);
    console.log("Wait! objectDetector not loaded yet.");
    return;
  } else {
    // 만약 webcam이 돌아가고 있는데 누르는건 이미 인식을 하고 있는데 누르는거니까
    // 표시하지 않고
    // 만약 webcam이 돌아가 있지 않은 상태라면 보여준다.
    if (!webcamRunning) {
      setTimeout(() => {
        Toastify({
          text: "좋아 시작!",
          duration: 1500,
          newWindow: false,
          close: true,
          gravity: "top", 
          position: "center", 
          stopOnFocus: true, 
          style: {
            background: "linear-gradient(to right, #DB9393, #F0CACA)",
          },
        }).showToast();
      }, 1000);
    } else {
      // webcam이 돌아가고 있는 상태에서 취소를 누른 것이기 때문에 인식 종료
      setTimeout(() => {
        Toastify({
          text: "이제 그만~",
          duration: 1500,
          newWindow: false,
          close: true,
          gravity: "top", 
          position: "center", 
          stopOnFocus: true, 
          style: {
            background: "linear-gradient(to right, #DB9393, #F0CACA)",
          },
        }).showToast();
      }, 1000);
    }
  }

  
  // 웹캠이 현재 실행되고 있는지 확인.
  if (webcamRunning === true) {
    webcamRunning = false;
    enableWebcamButton.innerText = "인식";
    enableWebcamButton.style.backgroundColor = "rgb(41, 116, 170)";
    circleCoordinate = []; // 단어 애니메이션의 좌표가 중첩되지 않도록 초기화.
  } else {
    webcamRunning = true;
    enableWebcamButton.style.backgroundColor = "#ec9f53";
    enableWebcamButton.innerText = "인식중";
    
    centerX = parseInt(animationRect.width / 2);
    centerY = parseInt(animationRect.height / 2);

    for (let i = 0; i < circles.length; i++) {
      const circleObject = document.getElementById(`wordCircle-${i}`);
      const circleRect = circleObject.getBoundingClientRect();
  
      let left = parseInt(circleRect.left);
      let top =  parseInt(circleRect.top);
      let right = left + parseInt(circleRect.width);
      let bottom = top + parseInt(circleRect.height);
      circleCoordinate.push([left, top, right-40, bottom-40, `wordCircle-${i}`]);
    }
  }

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

let lastVideoTime = -1;
let results = undefined;

async function predictWebcam() {
  // const webcamElement = document.getElementById("webcam");
  // canvasElement.style.height = video.videoHeight;
  // webcamElement.style.height = video.videoHeight;
  // canvasElement.style.width = video.videoWidth;
  // webcamElement.style.width = video.videoWidth;
  let startTimeMs = performance.now();
  // 마지막시간이 현재 시작한 시간이 아니라면
  if (lastVideoTime !== video.currentTime) {
    // 마지막으로 비디오를 실행한 시점을 현재 시점으로 바꿔준다.
    lastVideoTime = video.currentTime;
    // detectForVideo를 사용해서 비디오 프레임을 읽어들여서 감지한다.
    // results = handLandmarker.detectForVideo(video, startTimeMs);
    results = gestureRecognizer.recognizeForVideo(video, startTimeMs);
  }
  // canvasCtx.save();
  // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.landmarks) {
    if (results.gestures.length > 0) {
      const categoryName = results.gestures[0][0].categoryName;
      // 마우스 트랙킹 검사.
      hand_tracking(categoryName);
      // 손 모양 그리는 코드.
      // for (const landmarks of results.landmarks) {
      //   // 라인
      //   drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
      //     color: "white",
      //     lineWidth: 2,
      //   });
      //   // 서클
      //   drawLandmarks(canvasCtx, landmarks, {
      //     color: `${categoryName !== "Closed_Fist" ? "#FFCC33" : "#DC143C"}`,
      //     lineWidth: 2,
      //   });
      // }
    }
  }
  // canvasCtx.restore();
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }
  // } else {
  //   // 웹캠이 돌아가고 있지 않다면 삭제하자.
  //   // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // }
}



/**
 * @param {string} categoryName = 어떤 제스처인지를 인식하고 파라미터로 받아 처리.
 */

function hand_tracking (categoryName) { 
  const target = document.getElementById(wordTarget);
  let targetRect;

  if (target !== null) {
    targetRect = target.getBoundingClientRect();
  }
  
  // 드래깅 중이 아니라면
  if (!isDragging) {

    // 애니메이션 영역에 대한 이미지의 상대 좌표 계산
    aX = parseInt(animationRect.width * (1 - results.landmarks[0][12].x)) - parseInt(50/2);
    aY = parseInt(animationRect.height * results.landmarks[0][12].y) - parseInt(50/2);
    
    cursor.style.left = aX + "px";
    cursor.style.top = aY + "px";    
 
    // 마우스 이미지와 단어 애니메이션간 충돌검사
    // 만약 style이 없다면 진행하지 않음
    const handCircleContainer = document.querySelector(".hand-circle-content");
    if (handCircleContainer.childNodes.length-3 !== 0) {

      for (let i = 0; i < circleCoordinate.length; i++) {

        let check_X = (aX >= circleCoordinate[i][0] && aX <= circleCoordinate[i][2]);
        let check_Y = (aY  >= circleCoordinate[i][1] && aY  <= circleCoordinate[i][3]);
        let wordCheck = handCircleContainer.querySelector(`#${circleCoordinate[i][4]}`);
        // 범위 안에는 들어오지만 prompt에 없을때만 충돌했다고 가정 그럼 그 단어가 있는지 확인하면 되는거니까
        if ( check_X && check_Y && wordCheck) {
          console.log(`${circleCoordinate[i][4]} 와 충돌했습니다.`);
          wordTarget = circleCoordinate[i][4];
          wordTargetPosition = i;
          isDragging = true;
          break;
        }

      }
    }
  } else {
    
    // 드래깅 중이라면
    if (wordTarget !== null && isDragging && categoryName !== "Closed_Fist") {
      let style; 
      let matrix;

      if(target !== null) {
        style = window.getComputedStyle(target);
        matrix = new WebKitCSSMatrix(style.transform);
        aX = parseInt(animationRect.width * (1 - results.landmarks[0][12].x)) - parseInt(50/2);
        aY = parseInt(animationRect.height * results.landmarks[0][12].y) - parseInt(50/2);
      

        // 단어 & 마우스 같이 이동
        // 정확히 말하면 x, y로 이동한 값만큼을 빼주는 역할을 하는거다.
        // translateX, translateY로 이동되어지기 때문에 그 값만큼을 빼서 이동되지 않는 값으로 만들면
        // 보정이 되면서 이후에 저장된 값을 보정이되어 마우스의 값으로 변경되는 값이 저장되게 된다.
        target.style.left = aX - (matrix.m41) + "px";
        target.style.top = aY - (matrix.m42) + "px";

        // 드래깅 중이라면 이제 해당 target의 left와 top값이 bear영역 안에 왔다면
        const bearContainer = document.getElementById("bear");
        const bearRect = bearContainer.getBoundingClientRect();
        
        const check_X = (targetRect.left > bearRect.left && targetRect.left < bearRect.left + bearRect.width);
        const check_Y = (targetRect.top > bearRect.top && targetRect.top < bearRect.top + bearRect.height);


        if (check_X && check_Y) {
          if (wordTarget != null && isDragging) {
            console.log(wordTarget);
            let targetDiv = document.getElementById(wordTarget);
            let targetParent = targetDiv.parentNode;
          
            // 해당 단어가 중복되지 않는다면 해당 단어를 prompt에 넣어준다.
            if (prompt.includes(targetDiv.innerText) == false) {
              if (checkWord.innerText == "요기!") {
                checkWord.innerText = "";
              }
              const textContent = document.createElement("div");
              textContent.setAttribute("id", `${targetDiv.innerText}`);

              textContent.addEventListener("dblclick", () => {
                // console.log(typeof textContent.innerHTML.replace(", ", ""));
                // 여기서 삭제를 해주어야 하는데
                // slice를 이렇게 하면 안되는건가 그럼 특정 개체를 어떻게 삭제하지
                let removeIndex = null;
                for (let i = 0; i < prompt.length; i++) {
                  if (prompt[i] === textContent.innerHTML.replace(", ", "")) {
                    removeIndex = i;
                    break;
                  }
                }
                prompt.splice(removeIndex, 1);
                textContent.parentNode.removeChild(textContent);
              });

              textContent.style.cursor = "pointer";
              textContent.style.textAlign = "center";
              textContent.style.display = "flex";
              textContent.style.textContent = "center";
              textContent.style.alignItems = "center";
              textContent.style.position = "relative";
              textContent.style.width = "10%";
              textContent.style.height = "100%";
              textContent.style.color = "white";
              textContent.style.margin = "14px";
              textContent.style.visibility = "hidden";
              textContent.innerText = targetDiv.innerText + ", ";
              textContent.classList.add("prompt-object");
              // checkWord에는 추가를 했는데 쉼표까지 하려면?
              checkWord.appendChild(textContent);
              // 정규식을 통해서 문자열에 콤마만 삭제하고 prompt로 넣어준다.
              const text = textContent.innerHTML.replace(", ", "");
              prompt.push(text);
              // prompt.push(targetDiv.innerText);
              console.log(prompt);
            }
          
            targetParent.removeChild(targetDiv);
            wordTarget = null;
            wordTargetPosition = null;
            isDragging = false;
          }
        }
      }

      cursor.style.left = aX  + "px";
      cursor.style.top = aY  + "px";    

    } else if(wordTarget !== null && isDragging && categoryName === "Closed_Fist") {

      // 좌표수정
      if(target !== null) {
        circleCoordinate[wordTargetPosition][0] = parseInt(targetRect.left);
        circleCoordinate[wordTargetPosition][1] = parseInt(targetRect.top);
        circleCoordinate[wordTargetPosition][2] = (circleCoordinate[wordTargetPosition][0] + targetRect.width) - 40;
        circleCoordinate[wordTargetPosition][3] = (circleCoordinate[wordTargetPosition][1] + targetRect.height) - 40;
        isDragging = false;
        wordTarget = null;
      }
    }
  }
  mouse_tracker();
}

// '제스처 인식을 하지 않을때' 마우스 이벤트.
// 웸캠이 돌아가고 있을때는 mouseTracking 값이 달라져야 하니까
document.addEventListener("mousemove", (event) => {
  if (!webcamRunning) {
    cursor.style.visibility="hidden";
    mouseX = event.clientX - animationRect.left - parseInt(50/2);
    mouseY = event.clientY - animationRect.top - parseInt(50/2);
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
    
    if (isDragging && wordTarget != null) {
      let target = document.getElementById(wordTarget);
    
      let wordRelativeX = event.clientX - startPosX;
      let wordRelativeY = event.clientY - startPosY;
    
      target.style.left = parseInt(wordRelativeX) + "px";
      target.style.top = parseInt(wordRelativeY) + "px";
    }

    mouse_tracker(event);
  } else {
    cursor.style.visibility="visible";
    cursor.style.left = centerX + "px";
    cursor.style.top = centerY + "px";
  }


});

// '제서처 인식을 하지 않을때'
document.addEventListener("mouseup", () => {
  if (isDragging == true) {
    isDragging = false;
    wordTarget = null;
  }
});

// 위치 이동 함수.
function translate(selector, x, y) {
  selector.style.transform = `translate(${x}px, ${y}px)`;
}

// 입 크기 증가 함수.
function scale(selector, scale) {
  selector.style.transform = `scale(${scale})`;
}

// 마우스 트랙킹 함수.
function mouse_tracker(event=null) {
  // mouse의 초기좌표
  let mouse = { x: 0, y: 0 };

  let mouseCenter = {
    x: parseInt(animationContent.offsetWidth / 2),
    y: parseInt(animationContent.offsetHeight  / 2),
  };

  // 웸캠이 돌아가고 있을때 애니메이션이 돌아가는건 되었는데
  // 이제 저 단어의 좌표가 bear의 좌표에 갔을때 단어가 추가될지 말지를 결정해야 되니까
  if (webcamRunning){
    interact(null, mouse, mouseCenter);

  } else {
    // mouse x, y좌표에 따라서 눈과 몸통이 이동.
    interact(event, mouse, mouseCenter);
  }
}




// 곰과 마우스간 상호작용 하는 애니메이션 계산 함수.
function interact(e, mouse, mouseCenter) {
  
  const bearContainer = document.getElementById("bear");
  const faceContainer = document.getElementById("faceContainer");
  const handContainer = document.getElementById("handContainer");
  const nose = document.getElementById("nose");
  const ears = document.querySelectorAll(".ears");
  const bearMouse = document.getElementById("mouse");
  const hands = document.querySelectorAll(".hand");
  const earMoveRate = 5.5, handMoveRate = 5.5, faceMoveRate = 10.0;


  // 웹캠이 활성화 되었을때
  // 웹캠이 활성화 되지 않았을때
  mouse.x = (webcamRunning ? aX : e.clientX);
  mouse.y = (webcamRunning ? aY : e.clientY);


  // 얼굴 이동비율에 대해서 얼마나 떨어져 있는가를 나타내는것
  let dx = (mouse.x - mouseCenter.x) / faceMoveRate;
  let dy = (mouse.y - mouseCenter.y) / faceMoveRate;



  // 몸통 비율 조절
  translate(bearContainer, dx * 0.2, dy * 0.2);

  // 얼굴 비율 조절
  translate(faceContainer, dx * 0.2, dy * 0.2);

  // 귀 비율 조절
  for (let i = 0; i < ears.length; i++) {
    translate(ears[i], -dx / earMoveRate, -dy / earMoveRate);
    scale(ears[i], -1.2);
  }

  // 손 비율 조절
  for (let i = 0; i < hands.length; i++) {
    translate(hands[i], -dx / handMoveRate, -dy / handMoveRate);
  }

  // 코비율 조절
  translate(nose, dx * 0.2, dy * 0.2);

  // 핸드 컨테이너 조절
  translate(handContainer, dx * 0.2, dy * 0.2);

  // 입비율 조절
  if (dx < 0) {
    translate(bearMouse, dx * 0.3, dy * 0.2);
    scale(bearMouse, dx * -3);
  } else {
    translate(bearMouse, dx * 0.3, dy * 0.2);
    scale(bearMouse, dx * 3);
  }
  if (dy < 0) {
    scale(bearMouse, dy * -0.03);
  } else {
    scale(bearMouse, dy * 0.03);
  }
}

// 곰 애니메이션
function polarBear3D() {
  const bearContent = document.querySelector(".hand-bear-content");
  const bear = document.createElement("div");
  bear.setAttribute("id", "bear");
  const bearCSS = bear.style;

  // bear 몸통
  bearCSS.display = "flex";
  bearCSS.justifyContent = "center";
  bearCSS.position = "absolute";
  bearCSS.bottom = "0";
  bearCSS.width = "20vw";
  bearCSS.height = "32vh";
  bearCSS.borderRadius = "220px 220px 0 0";
  bearCSS.backgroundColor = "white";

  bearContent.appendChild(bear);

  // 손 박스
  const handContainer = document.createElement("div");
  handContainer.setAttribute("id", "handContainer");
  const handContainerCSS = handContainer.style;
  handContainerCSS.position = "absolute";
  handContainerCSS.display = "flex";
  handContainerCSS.justifyContent = "space-around";
  handContainerCSS.padding = "22px";
  handContainerCSS.width = "30vw";
  handContainerCSS.height = "5vh";
  handContainerCSS.top = "50%";
  // handContainerCSS.backgroundColor = "black";

  bear.appendChild(handContainer);

  // 왼손
  const leftHand = document.createElement("div");
  const leftHandCSS = leftHand.style;
  leftHand.classList.add("hand");
  leftHandCSS.position = "absolute";
  leftHandCSS.width = "20%";
  leftHandCSS.left = "8%";
  leftHandCSS.height = "100%";
  leftHandCSS.backgroundColor = "white";
  leftHandCSS.borderRadius = "350px 50px 450px 100px";

  handContainer.appendChild(leftHand);

  // 오른손
  const rightHand = document.createElement("div");
  const rightHandCSS = rightHand.style;
  rightHand.classList.add("hand");
  rightHandCSS.position = "absolute";
  rightHandCSS.width = "20%";
  rightHandCSS.right = "8%";
  rightHandCSS.height = "100%";
  rightHandCSS.backgroundColor = "white";
  rightHandCSS.borderRadius = "50px 350px 100px 450px";

  handContainer.appendChild(rightHand);

  // 안면 제한 박스
  const limitContainer = document.createElement("div");
  const limitCSS = limitContainer.style;
  limitContainer.setAttribute("id", "limitContainer");
  limitCSS.position = "absolute";
  limitCSS.display = "flex";
  limitCSS.justifyContent = "center";
  limitCSS.top = "5%";
  limitCSS.width = "10vw";
  limitCSS.height = "100%";
  limitCSS.zIndex = 4;
  // limitCSS.backgroundColor="red";

  bear.appendChild(limitContainer);

  // 얼굴 박스
  const faceContainer = document.createElement("div");
  const faceCSS = faceContainer.style;
  faceContainer.setAttribute("id", "faceContainer");
  faceCSS.position = "absolute";
  faceCSS.display = "flex";
  faceCSS.justifyContent = "center";
  faceCSS.top = "0%";
  faceCSS.width = "100%";
  faceCSS.height = "10%";
  // faceCSS.backgroundColor="orange";
  faceCSS.zIndex = 3;
  limitContainer.appendChild(faceContainer);

  // 귀 위치 잡는 컨테이너
  const bearEearContainer = document.createElement("div");
  const bearEearContainerCSS = bearEearContainer.style;
  bearEearContainer.setAttribute("id", "bearEarContainer");

  bearEearContainerCSS.position = "absolute";
  bearEearContainerCSS.display = "flex";
  bearEearContainerCSS.justifyContent = "space-around";

  bearEearContainerCSS.top = "1%";
  bearEearContainerCSS.bottom = "0";
  bearEearContainerCSS.width = "150%";
  bearEearContainerCSS.height = "30%";
  bearEearContainerCSS.zIndex = 2;
  // bearEearContainerCSS.backgroundColor="red";
  bear.appendChild(bearEearContainer);
  // 왼쪽 귀
  const bearLeftEar = document.createElement("div");
  const bearLeftEarCSS = bearLeftEar.style;
  // bearLeftEar.setAttribute("id", "ear");
  bearLeftEar.classList.add("ears");
  bearLeftEarCSS.width = "100px";
  bearLeftEarCSS.height = "100px";
  bearLeftEarCSS.borderRadius = "50%";
  bearLeftEarCSS.backgroundColor = "white";
  bearLeftEarCSS.zIndex = 1;
  bearEearContainer.appendChild(bearLeftEar);

  // 오른쪽 귀
  const bearRightEar = document.createElement("div");
  const bearRightEarCSS = bearRightEar.style;

  // bearRightEar.setAttribute("id", "ear");
  bearRightEar.classList.add("ears");
  bearRightEarCSS.width = "100px";
  bearRightEarCSS.height = "100px";
  bearRightEarCSS.borderRadius = "50%";
  bearRightEarCSS.backgroundColor = "white";
  bearRightEarCSS.zIndex = 1;

  bearEearContainer.appendChild(bearRightEar);

  // 눈 박스
  const eyeContainer = document.createElement("div");
  const eyeContainerCSS = eyeContainer.style;
  eyeContainer.setAttribute("id", "eyeContainer");

  eyeContainerCSS.display = "flex";
  eyeContainerCSS.justifyContent = "space-between";
  eyeContainerCSS.position = "absolute";
  eyeContainerCSS.top = "10%";
  eyeContainerCSS.left = "50%";
  eyeContainerCSS.width = "82px";
  eyeContainerCSS.height = "20px";
  eyeContainerCSS.marginLeft = "-41px";
  // eyeContainerCSS.backgroundColor="blue";

  // 왼쪽 눈
  const leftEye = document.createElement("div");
  const leftEyeCSS = leftEye.style;
  leftEye.setAttribute("id", "leftEye");
  leftEye.classList.add("left-eye");

  leftEyeCSS.width = "20px";
  leftEyeCSS.height = "100%";
  leftEyeCSS.borderRadius = "50%";
  leftEyeCSS.backgroundColor = "black";

  // 오른쪽 눈
  const rightEye = document.createElement("div");
  const rightEyeCSS = rightEye.style;
  rightEye.setAttribute("id", "rightEye");
  rightEye.classList.add("right-eye");

  rightEyeCSS.width = "20px";
  rightEyeCSS.height = "100%";
  rightEyeCSS.borderRadius = "50%";
  rightEyeCSS.backgroundColor = "black";

  eyeContainer.appendChild(leftEye);
  eyeContainer.appendChild(rightEye);
  faceContainer.appendChild(eyeContainer);

  // 코 음영
  const phizContainer = document.createElement("div");
  const phizContainerCSS = phizContainer.style;
  phizContainer.classList.add("phizContainer");
  phizContainer.setAttribute("id", "phizContainer");
  phizContainerCSS.position = "absolute";
  phizContainerCSS.display = "flex";
  phizContainerCSS.justifyContent = "center";
  phizContainerCSS.top = "10%";
  phizContainerCSS.width = "60%";
  phizContainerCSS.height = "50%";
  phizContainerCSS.borderRadius = "100px";
  phizContainerCSS.backgroundColor =
    "rgb(" + 222 + ", " + 249 + "," + 254 + ")";

  limitContainer.appendChild(phizContainer);

  // 코
  const nose = document.createElement("div");
  const noseCSS = nose.style;
  nose.setAttribute("id", "nose");

  noseCSS.position = "absolute";
  noseCSS.top = "6%";
  noseCSS.width = "50px";
  noseCSS.height = "60px";
  noseCSS.borderRadius = "50%";
  noseCSS.backgroundColor = "black";

  phizContainer.appendChild(nose);

  // 코 음영
  const dot = document.createElement("div");
  const dotCSS = dot.style;
  dot.setAttribute("id", "dot");

  dotCSS.position = "absolute";
  dotCSS.left = "16%";
  dotCSS.top = "16%";
  dotCSS.width = "20px";
  dotCSS.height = "20px";
  dotCSS.borderRadius = "50%";
  dotCSS.backgroundColor = "white";

  nose.appendChild(dot);

  // 입
  const mouse = document.createElement("div");
  const mouseCSS = mouse.style;
  mouse.setAttribute("id", "mouse");
  mouseCSS.top = "80%";
  mouseCSS.position = "absolute";
  mouseCSS.width = "40px";
  mouseCSS.height = "25px";
  mouseCSS.borderRadius = "0px 0px 20px 20px";
  mouseCSS.backgroundColor = "black";

  phizContainer.appendChild(mouse);


  // bear영역에 단어를 끌어 왔다면
  bear.addEventListener("mouseover", () => {
    // 특정 단어를 잡아서 드래깅 하고 있다면
    if (wordTarget != null && isDragging) {
      console.log(wordTarget);
      let targetDiv = document.getElementById(wordTarget);
      let targetParent = targetDiv.parentNode;

      // 해당 단어가 중복되지 않는다면 해당 단어를 prompt에 넣어준다.
      if (prompt.includes(targetDiv.innerText) == false) {
        if (checkWord.innerText == "요기!") {
          checkWord.innerText = "";
        }
        const textContent = document.createElement("div");
        textContent.setAttribute("id", `${targetDiv.innerText}`);

        // 해당 워드 리스트를 더블 클릭 했다면
        // 해당 부모에서도 지워주고
        // prompt 데이터에서도 지워준다.
        textContent.addEventListener("dblclick", () => {
          // console.log(typeof textContent.innerHTML.replace(", ", ""));
          // 여기서 삭제를 해주어야 하는데
          // slice를 이렇게 하면 안되는건가 그럼 특정 개체를 어떻게 삭제하지
          let removeIndex = null;
          for (let i = 0; i < prompt.length; i++) {
            if (prompt[i] === textContent.innerHTML.replace(", ", "")) {
              removeIndex = i;
              break;
            }
          }
          prompt.splice(removeIndex, 1);
          textContent.parentNode.removeChild(textContent);
        });
        textContent.style.cursor = "pointer";
        textContent.style.textAlign = "center";
        textContent.style.display = "flex";
        textContent.style.textContent = "center";
        textContent.style.alignItems = "center";
        textContent.style.position = "relative";
        textContent.style.width = "10%";
        textContent.style.height = "100%";
        textContent.style.color = "white";
        textContent.style.margin = "14px";
        textContent.style.visibility = "hidden";
        textContent.innerText = targetDiv.innerText + ", ";
        textContent.classList.add("prompt-object");
        // checkWord에는 추가를 했는데 쉼표까지 하려면?
        checkWord.appendChild(textContent);
        // 정규식을 통해서 문자열에 콤마만 삭제하고 prompt로 넣어준다.
        const text = textContent.innerHTML.replace(", ", "");
        prompt.push(text);
        console.log(prompt);
        // prompt.push(targetDiv.innerText);
        // console.log(prompt);
      }

      targetParent.removeChild(targetDiv);
      wordTarget = null;
    }
  });
}

// 서클
function circleSection() {
  const handCircleContent = document.querySelector(".hand-circle-content");
  circleAnimation(handCircleContent);
}

// 단어 애니메이션 지정 함수.
function circleAnimation(parent) {
  const maxX = parent.offsetWidth - 40;
  const maxY = parent.offsetHeight - 40;

  // 단어가 존재하지 않을때는 서클을 생성할 수 없음.
  // 단어를 생성한다음에
  for (let i = 0; i < wordList.length; i++) {
    // circle안에 텍스트가 들어가야 되기 때문에
    const wordCircleDiv = document.createElement("word-circle");
    const divInnerText = document.createTextNode(wordList[i]);

    wordCircleDiv.setAttribute("id", `wordCircle-${i}`);
    wordCircleDiv.appendChild(divInnerText);

    wordCircleDiv.style.boxSizing = "border-box";
    wordCircleDiv.style.position = "absolute";
    wordCircleDiv.style.display = "flex";
    wordCircleDiv.style.justifyContent = "center";
    wordCircleDiv.style.alignItems = "center";

    wordCircleDiv.addEventListener("mousedown", (event) => {
      console.log("here");
      isDragging = true;
      wordTarget = wordCircleDiv.id;

      startPosX = event.clientX - wordCircleDiv.offsetLeft;
      startPosY = event.clientY - wordCircleDiv.offsetTop;  
    });

    let animeCircle = parent.appendChild(wordCircleDiv);
    animeCircle.classList.add("anime-circle");
  }

  circles = document.querySelectorAll(".anime-circle");

  // 서클 애니메이션
  anime({
    targets: circles,
    background: () => {
      let hue = anime.random(0, 360);
      let saturation = 60;
      let lumonisity = 70;
      let hslValue = "hsl(" + hue + "," + saturation + "%," + lumonisity + "%)";
      return hslValue;
    },
    borderRadius: () => {
      return anime.random(30, 50);
    },
    translateX: () => {
      let x = anime.random(-maxX / 2, maxX / 2) + "px";
      return x;
    },
    translateY: () => {
      let y = anime.random(-maxY / 2, maxY / 3) + "px";
      return y;
    },
    scale: () => {
      return anime.random(2.45, 3.55);
    },
    duration: () => {
      return anime.random(250, 1500);
    },
    delay: () => {
      return anime.random(300, 1000);
    },
    // rotate: () => {
    //   return anime.random(-360, 360);
    // },
    loop: false,
    direction: "alternate",
    easing: "easeInOutQuad",
  });
}

// 애니메이션이 끝난 직후 좌표를 알 수 있기 때문에
// circle리스트에 포함을 시켜야하는데 현재 left, top, 그리고 아이디까지


// 사용할 단어를 확인할때
checkWord.addEventListener("mouseover", () => {
  if (checkWord.innerText == "요기!") {
    checkWord.innerText = "";
  } else {
    if (checkWord.children.length != 0) {
      for (let i = 0; i < checkWord.children.length; i++) {
        checkWord.childNodes[i].style.visibility = "visible";
      }
    }
  }
});

// 사용할 단어를 확인하는 곳에서 마우스가 벗어났을때
checkWord.addEventListener("mouseleave", () => {
  if (checkWord.children.length != 0) {
    for (let i = 0; i < checkWord.children.length; i++) {
      checkWord.childNodes[i].style.visibility = "hidden";
    }
  } else {
    checkWord.innerText = "요기!";
  }
});

// 클릭시 모델 선택 페이지 이동.
bulb.addEventListener("click", () => {
  console.log(prompt.length);
  if (prompt.length === 0) {
    Toastify({
      text: "단어가 없는데..?",
      duration: 1500,
      newWindow: false,
      close: true,
      gravity: "top", 
      position: "center", 
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(to right, #DB9393, #F0CACA)",
      },
    }).showToast();
  } else {
    localStorage.setItem("wordList", JSON.stringify(prompt));
    window.location.href = "model_choice_page/";
  }
});

