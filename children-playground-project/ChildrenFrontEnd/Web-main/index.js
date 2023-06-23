// textarea enter 입력시 해당 단어를 전부 가지고 와서 리스트에 추가
const wordArea = document.getElementById("word-area");
const toggleBtn = document.getElementById("toggle-btn");
const gausianScreen = document.querySelectorAll(".gausian");
const completeBtn = document.getElementById("complete-btn");

let duplicate = false;
// wordList
let wordList = [];
let circlePosList = [];

// onKeyDown: keycode 값 - 한/영, Shift, Backsapce 등 인식 가능
// onKeyPress: ASCII 값 - 한/영, Shift, Backsapce 등 인식 불가
// 워드를 입력하지 않았을때

wordArea.addEventListener("keydown", (event) => {
  // 만약 애니메이션 Div1이 남아있다면 삭제한다.
  let element = document.getElementById("Div1");
  if (element) {
    element.parentNode.removeChild(element);
  } else {
    duplicate = false;
  }
  // 워드를 입력하지 않았을때
  if (wordArea.length != 0) {
    completeBtn.style.visibility = "visible";
  }

  // 엔터키를 눌렀을때
  if (event.key === "Enter") {
    let whitespaceRegex = /^\s*$/;
    let word = wordArea.value;

    // 공백 문자가 들어오는 경우 리스트에 추가되지 않도록
    if (whitespaceRegex.test(word)) {
      event.preventDefault();
      return;
    }

    // shift + enter조합막기
    if (event.shiftKey === true && event.key === "Enter") {
      event.preventDefault();
    }

    // shift 키를 누르지 않은 상태에서
    // 모든 단어가 다 모아졌다면 단어추가
    if (event.isComposing === false && !event.shiftKey) {
      wordList.push(word);
      console.log(wordList);
    } else {
      return;
    }
    event.preventDefault();
    wordArea.value = "";
    completeBtn.style.visibility = "hidden";
  }
});

// Document.querySelector()는 제공한 선택자 또는 선택자 뭉치와 일치하는 문서 내 첫 번째 Element를 반환합니다. 일치하는 요소가 없으면 null을 반환합니다.(MDN)
// Document.getElementById() 메서드는 주어진 문자열과 일치하는 id 속성을 가진 요소를 찾고, 이를 나타내는 Element 객체를 반환합니다. ID는 문서 내에서 유일해야 하기 때문에 특정 요소를 빠르게 찾을 때 유용합니다.(MDN)

// 토글 버튼 클릭시 gausian & image icon 삭제
toggleBtn.addEventListener("click", (event) => {
  // 만약 토글 버튼이 체크되었다면
  // 가우시안 페이지를 전부 걷어냄 이미지와 함께
  if (event.target.innerText === "숨기기") {
    event.target.innerText = "보이기";
    for (let i = 0; i < gausianScreen.length; i++) {
      gausianScreen[i].style.visibility = "hidden";
    }
  } else {
    event.target.innerText = "숨기기";
    for (let i = 0; i < gausianScreen.length; i++) {
      gausianScreen[i].style.visibility = "visible";
    }
  }
});

// 완료 버튼 누를시 화면을 새로운 걸로 바꾸고
// image-box, toggle-btn, complete-btn, textArea 를 display block으로 없앰
completeBtn.addEventListener("click", () => {
  // 1. image-section안에 있는 four-image-section을 숨긴다.
  // 2. div를 image-section에 추가
  // 3. 단어들을 뿌리는 효과를 생성.
  const fourImageSection = document.querySelector(".four-image-section");
  const imageBox = document.querySelectorAll(".image-box");
  for (let i = 0; i < imageBox.length; i++) {
    imageBox[i].style.display = "none";
  }

  // 중복된 id값이 존재하지 않을경우 디브생성
  let elements = document.querySelectorAll("[id]");

  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === "Div1") {
      console.log("Duplicate [ID] value");
      duplicate = true;
      break;
    }
  }

  // 중복이 존재하지 않는다면 추가
  if (!duplicate) {
    // circle 영역 추가
    circleSection(fourImageSection);
  }
});

// 서클영역
function circleSection(parent) {
  let circleDiv = document.createElement("div");
  circleDiv.setAttribute("id", "Div1"); // 새로운 디브에 대한 css
  circleDiv.style.width = "100%";
  circleDiv.style.height = "100%";

  circleDiv.style.backgroundColor =
    "rgba(" + 88 + ", " + 190 + ", " + 223 + ", " + 1 + ")";
  circleDiv.style.display = "flex";
  circleDiv.style.justifyContent = "center";
  circleDiv.style.alignItems = "center";
  circleDiv.style.textAlign = "center";
  circleDiv.style.position = "relative";
  // circleDiv.style.overflow = "scroll";
  // console.log(imageBox);
  console.log(circleDiv);
  parent.appendChild(circleDiv);

  // 원형 서클 애니메이션
  circleAnimation(circleDiv);
  // 북극곰 3D 모델링
  polarBear3D(circleDiv);
  // mouse tracker
  circleDiv.addEventListener("mousemove", mouseTracker);
}
// circle animation.
function circleAnimation(parent) {
  for (let i = 0; i < wordList.length; i++) {
    // circle안에 텍스트가 들어가야 되기 때문에
    let wordCircleDiv = document.createElement("div");
    const divInnerText = document.createTextNode(wordList[i]);
    wordCircleDiv.style.fontSize = "10";
    wordCircleDiv.appendChild(divInnerText);

    wordCircleDiv.style.position = "absolute";
    wordCircleDiv.style.display = "flex";
    wordCircleDiv.style.justifyContent = "center";
    wordCircleDiv.style.alignItems = "center";
    animeCircle = parent.appendChild(wordCircleDiv);
    animeCircle.classList.add("anime-circle");
  }

  let circles = document.querySelectorAll(".anime-circle");
  // 340, 270
  // circle div 를 하나 더 만드는게 좋을거 같네
  // 그리고 그거의 absolute를 주는게 더 바람직하겠다.
  const maxX = parent.offsetWidth - 40;
  const maxY = parent.offsetHeight - 40;

  let randomAnimation = anime({
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
    // 뷰포트를 기준으로 하는걸 바꿔야하고
    translateX: () => {
      // x좌표를 설정해주고
      let x = anime.random(-maxX / 2, maxX / 2) + "px";
      return x;
    },
    translateY: () => {
      let y = anime.random(-maxY / 2, maxY / 3) + "px";
      return y;
    },
    scale: () => {
      return anime.random(1.45, 2.55);
    },
    duration: () => {
      return anime.random(250, 1500);
    },
    delay: () => {
      return anime.random(500, 1000);
    },
    loop: false,
    direction: "alternate",
    easing: "easeInOutQuad",
  });
}

// polar bear animation
function polarBear3D(parent) {
  const bear = document.createElement("div");
  bear.setAttribute("id", "bear");
  const bearCSS = bear.style;
  // bear 몸통
  bearCSS.display = "flex";
  bearCSS.justifyContent = "center";
  bearCSS.position = "absolute";
  bearCSS.bottom = "0";
  bearCSS.width = "20vw";
  bearCSS.height = "30vh";
  bearCSS.borderRadius = "220px 220px 0 0";
  bearCSS.backgroundColor = "white";


  parent.appendChild(bear);


  // 안면 제한 박스
  const limitContainer = document.createElement("div");
  const limitCSS = limitContainer.style;
  limitContainer.setAttribute("id", "limitContainer");
  limitCSS.position = "absolute";
  limitCSS.display = "flex";
  limitCSS.justifyContent = "center";
  limitCSS.alignItems = "center";
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
  faceCSS.height = "20%";
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
  phizContainer.setAttribute("id", "phizContainer");
  phizContainerCSS.position = "absolute";
  phizContainerCSS.display = "flex";
  phizContainerCSS.justifyContent = "center";
  phizContainerCSS.top = "20%";
  phizContainerCSS.width = "60%";
  phizContainerCSS.height = "60%";
  phizContainerCSS.borderRadius = "100px";
  phizContainerCSS.backgroundColor =
    "rgb(" + 222 + ", " + 249 + "," + 254 + ")";

  limitContainer.appendChild(phizContainer);

  // 코
  const nose = document.createElement("div");
  const noseCSS = nose.style;
  nose.setAttribute("id", "nose");

  noseCSS.position = "relative";
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
  mouseCSS.width = "30px";
  mouseCSS.height = "15px";
  mouseCSS.borderRadius = "0px 0px 15px 15px";
  mouseCSS.backgroundColor = "black";

  phizContainer.appendChild(mouse);

  // const bear
}

// mouse Tracker
function mouseTracker(event) {
  // console.log(`Screen X(pos) : ${event.x}`);
  // console.log(`Screen Y(pos) : ${event.y}`);
  // 마우스가 트랙킹 되면
  // bear의 시선이 마우스쪽으로 향하는거

  const parent = document.getElementById("Div1");
  // mouse의 초기좌표
  let mouse = { x: 0, y: 0 };
  // mouse의 가운데 지점 좌표
  let mouseCenter = {
    x: parseInt(parent.offsetWidth / 2),
    y: parseInt(parent.offsetHeight / 2),
  };
  // console.log(mouseCenter);

  let limitContainer = document.getElementById("bear");
  let faceContainer = document.getElementById("faceContainer");
  let nose = document.getElementById("nose");
  let ears = document.querySelectorAll(".ears");
  let bearMouse = document.getElementById("mouse");
  // console.log(ears);

  var eyeSize = 20,
    eyeSizeRate = 12,
    noseMoveRate = 2.5,
    earMoveRate = 5.5,
    faceMoveRate = 10;

  // mouse x, y좌표에 따라서 눈과 몸통이 이동.
  interact(
    event,
    faceMoveRate,
    earMoveRate,
    noseMoveRate,
    eyeSizeRate,
    eyeSize,
    mouseCenter,
    limitContainer,
    faceContainer,
    ears,
    nose,
    bearMouse
  );
}

// 위치 이동
function translate (selector, x, y) {
  selector.style.transform = 
      'translate(' + x + 'px,' + y + 'px)';
}

function scale(selector, scale) {
  selector.style.transform = `scale(${scale})`;
}

// interact 함수
function interact(
  e,
  faceMoveRate,
  earMoveRate,
  noseMoveRate,
  eyeSizeRate,
  eyeSize,
  mouseCenter,
  limitContainer,
  faceContainer,
  ears,
  nose,
  mouse
) {
  // 첫번째 터치지점의 x, y좌표를 만약에 touch이벤트가 존재할 경우에

  mouse.x = e.clientX;
  mouse.y = e.clientY;
  // console.log(mouse.x);
  // console.log(mouse.x);
  // 얼굴 이동비율에 대해서 얼마나 떨어져 있는가를 나타내는것
  let dx = (mouse.x - mouseCenter.x) / faceMoveRate,
    dy = (mouse.y - mouseCenter.y) / faceMoveRate,
    classX = dx < 0 ? "left" : "right";

  // 그럼 얼굴 중심으로 부터 얼마나 떨어져 있는 지를 비율로써 나타내고

  let limit = {
    left: -(limitContainer.offsetWidth - faceContainer.offsetWidth) / 2,
    right: (limitContainer.offsetWidth - faceContainer.offsetWidth) / 2,
    top: -(limitContainer.offsetHeight - faceContainer.offsetHeight) / 2,
    bottom: (limitContainer.offsetHeight - faceContainer.offsetHeight) / 2,
  };
  
  // x, y좌표 비율에 대한 좌표
  console.log(
    `x : ${dx},
     y : ${dy},
     left : ${limit.left}, 
     right : ${limit.right}, 
     top : ${limit.top}, 
     bottom : ${limit.bottom}`);

  // dx = dx > limit.left ? dx : 
  // dx = dx < limit.left ? limit.left : dx > limit.right ? limit.right : dx;

  // dy = dy < limit.top ? limit.top : dy > limit.bottom ? limit.bottom : dy;
  console.log(dx + ", " + dy);


  // dx 값에 따라서 dx가 0보다 작으면 왼쪽 눈을 기준
  // dx 값이 0보다 크다면 오른쪽 눈을 기준
  let eye = document.getElementsByClassName(classX + '-eye')[0];
  // console.log(eye);
  

  // 눈비율을 측정하고 혀재 눈 사이즈 에서 dx만큼 빼고
  // 눈의 비율 대비 얼마나 크게할지 정함.
  let size = Math.round(eyeSize - Math.abs(dx)/eyeSizeRate);
  // let margin = Math.round((eyeSize - size)/2);

  // eye.style.cssText = 'width:' + size + 'px; \
  //                        height:' + size + 'px;'

  // fish.style.cssText =
  //     'left:' + mouse.x + 'px; \
  //      top:' + mouse.y + 'px;'

  translate(faceContainer, dx * 0.2, dy * 0.2);

  // 귀의 위치도 조절
  // 귀비율 대비
  for (let i = 0; i < ears.length; i++) {
      translate(ears[i], -dx/earMoveRate, -dy/earMoveRate);
  }
  
  translate(nose, dx * 0.2, dy * 0.2);
  if(dx < 0) {
    translate(mouse, dx * 0.2 * 0.1, dy * 0.2);
    scale(mouse, dx * -0.03);
  } else {
    translate(mouse, dx * 0.2 * -0.1, dy * 0.2);
    scale(mouse, dx * 0.03);
  }
  
  translate(phizContainer, dx/noseMoveRate, dy/noseMoveRate);
}
