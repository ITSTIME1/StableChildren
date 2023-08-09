import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

let handLandmarker = undefined;
let runningMode = "video";
let enableWebcamButton;
let webcamRunning = false;
// getUsermedia parameters.
let constraints = {
  video: true,
};

// 손 인식 개수는 1개
const createHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    // GPU 사용
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU",
    },
    runningMode: runningMode,
    numHands: 1,
  });
};

createHandLandmarker();

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// Check if webcam access is supported.
const hasGetUserMedia = () => {
  var _a;
  return !!((_a = navigator.mediaDevices) === null || _a === void 0
    ? void 0
    : _a.getUserMedia);
};

// 웹캠을 가지고 있는지 가지고 있지 않은지를 검사하는거고
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// 여기서부터가 실제 웹캠이 켜지면서 동작하는 곳.
// Enable the live webcam view and start detection.
function enableCam() {
  if (!handLandmarker) {
    setTimeout(() => {
      Toastify({
        text: "아직 인식 준비중 입니다!",
        duration: 3000,
        newWindow: false,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #DB9393, #F0CACA)",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    }, 1000);
    console.log("Wait! objectDetector not loaded yet.");
    return;
  } else {
    // 만약 webcam이 돌아가고 있는데 누르는건 이미 인식을 하고 있는데 누르는거니까
    // 표시하지 않고
    // 만약 webcam이 돌아가 있지 않은 상태라면 보여준다.
    if (!webcamRunning) {
      console.log(handLandmarker);
      setTimeout(() => {
        Toastify({
          text: "인식 완료!",
          duration: 1500,
          newWindow: false,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #DB9393, #F0CACA)",
          },
          onClick: function () {}, // Callback after click
        }).showToast();
      }, 1000);
    } else {
      // webcam이 돌아가고 있는 상태에서 취소를 누른 것이기 때문에 인식 종료
      setTimeout(() => {
        Toastify({
          text: "인식 종료!",
          duration: 1500,
          newWindow: false,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #DB9393, #F0CACA)",
          },
          onClick: function () {}, // Callback after click
        }).showToast();
      }, 1000);
    }
  }

  // 웹캠 돌아가냐 안돌아가냐에 따라서 텍스트 변경.
  if (webcamRunning === true) {
    webcamRunning = false;
    // 웹캠을 끄고 캠버스를 지움
    enableWebcamButton.innerText = "인식";
  } else {
    webcamRunning = true;
    enableWebcamButton.innerText = "해제";
  }
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
  // 좌우 반전을 해결하는 코드.
  canvasCtx.translate(video.videoWidth, 0);
  canvasCtx.scale(-1, 1);
  canvasCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      // 라인
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: "white",
        lineWidth: 2,
      });
      // 서클
      drawLandmarks(canvasCtx, landmarks, { color: "#FFCC33", lineWidth: 2 });
    }
  }
  canvasCtx.restore();
  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  } else {
    // 웹캠이 돌아가고 있지 않다면 삭제하자.
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
}

// mediapie_code
//##################################
// animation_code

const checkWord = document.querySelector(".third-content");
const bulb = document.getElementById("bulb");

let wordTarget = null,
  wordList = null,
  startPosX = null,
  startPosY = null;
let isDragging = false;
let prompt = [];

// 처음 시작할때 곰을 그려준다.
if (localStorage.getItem("wordList")) {
  wordList = JSON.parse(localStorage.getItem("wordList"));
}

polarBear3D();
circleSection();

// 마우스가 움직일때마다 마우스 트랙킹.
document.addEventListener("mousemove", (event) => {
  mouseTracker(event);
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
function mouseTracker(event) {
  const parent = document.querySelector(".hand-animation-content");
  // mouse의 초기좌표
  let mouse = { x: 0, y: 0 };
  // mouse의 가운데 지점 좌표
  let mouseCenter = {
    x: parseInt(parent.offsetWidth / 2),
    y: parseInt(parent.offsetHeight / 2),
  };
  // console.log(mouseCenter);

  // mouse x, y좌표에 따라서 눈과 몸통이 이동.
  interact(event, mouse, mouseCenter);
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

  const noseMoveRate = 2.5,
    earMoveRate = 5.5,
    handMoveRate = 5.5,
    faceMoveRate = 10;

  // 첫번째 터치지점의 x, y좌표를 만약에 touch이벤트가 존재할 경우에

  mouse.x = e.clientX;
  mouse.y = e.clientY;
  // console.log(mouse.x);
  // console.log(mouse.x);
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
  let phizContainer = document.createElement("div");
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
  // console.log(phizContainerDiv);

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
  const animationContent = document.querySelector(".hand-circle-content");
  circleAnimation(animationContent);
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
      isDragging = true;
      wordTarget = wordCircleDiv.id;

      startPosX = event.clientX - wordCircleDiv.offsetLeft;
      startPosY = event.clientY - wordCircleDiv.offsetTop;
    });

    let animeCircle = parent.appendChild(wordCircleDiv);
    animeCircle.classList.add("anime-circle");
  }

  let circles = document.querySelectorAll(".anime-circle");

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

// 단어를 드래깅 할때.
document.addEventListener("mousemove", (event) => {
  if (isDragging && wordTarget != null) {
    let targeted_word = document.getElementById(wordTarget);

    let xPos = event.clientX - startPosX;
    let yPos = event.clientY - startPosY;

    targeted_word.style.left = xPos + "px";
    targeted_word.style.top = parseInt(yPos) + "px";
  }
});

// 단어에서 드래깅이 풀렸을때.
document.addEventListener("mouseup", () => {
  if (isDragging == true) {
    isDragging = false;
    wordTarget = null;
  }
});

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
      text: "단어가 없어요!",
      duration: 1500,
      newWindow: false,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #DB9393, #F0CACA)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  } else {
    window.location.href = "model_choice_page/";
  }
});
