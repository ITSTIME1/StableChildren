// 서클영역.
const checkWord = document.getElementById("list");
let wordList = [];
let prompt = [];
let startPosX, startPosY;
let isDragging = false;
let wordTarget = null;
let phizContainerDiv = null;
// git test.

// 서클 영역 지정 함수.
export function circleSection(word) {
  const fourImageSection = document.querySelector(".four-image-section");
  // console.log(fourImageSection);
  wordList = word;
  console.log(wordList);
  let circleDiv = document.createElement("div");
  let animationDiv = document.createElement("div");
  // 새로운 디브에 대한 css
  circleDiv.setAttribute("id", "Div1");
  circleDiv.style.width = "100%";
  circleDiv.style.height = "100%";

  circleDiv.style.backgroundColor =
    "rgba(" + 88 + ", " + 190 + ", " + 223 + ", " + 1 + ")";
  circleDiv.style.display = "flex";
  circleDiv.style.justifyContent = "center";
  // circleDiv.style.alignItems = "center";
  circleDiv.style.textAlign = "center";
  circleDiv.style.position = "relative";
  // circleDiv.style.overflow = "scroll";

  // animation
  animationDiv.setAttribute("id", "animationDiv");

  animationDiv.style.width = "100%";
  animationDiv.style.height = "55%";

  animationDiv.style.backgroundColor =
    "rgba(" + 88 + ", " + 190 + ", " + 223 + ", " + 1 + ")";
  animationDiv.style.display = "flex";
  animationDiv.style.justifyContent = "center";
  animationDiv.style.alignItems = "center";
  animationDiv.style.textAlign = "center";
  animationDiv.style.position = "relative";
  // animationDiv.style.backgroundColor = "blue";

  // 애니메이션 디브 추가
  fourImageSection.appendChild(circleDiv);
  circleDiv.appendChild(animationDiv);

  // 원형 서클 애니메이션
  circleAnimation(animationDiv);
  // 북극곰 3D 모델링
  polarBear3D(circleDiv);
  // mouse tracker
  circleDiv.addEventListener("mousemove", mouseTracker);
}

// 단어 애니메이션 지정 함수.
function circleAnimation(parent) {
  console.log(parent);
  for (let i = 0; i < wordList.length; i++) {
    // circle안에 텍스트가 들어가야 되기 때문에
    let wordCircleDiv = document.createElement("div");
    wordCircleDiv.setAttribute("id", `wordCircle-${i}`);
    const divInnerText = document.createTextNode(wordList[i]);
    wordCircleDiv.appendChild(divInnerText);

    wordCircleDiv.style.boxSizing = "border-box";
    wordCircleDiv.style.position = "absolute";
    wordCircleDiv.style.display = "flex";
    wordCircleDiv.style.justifyContent = "center";
    wordCircleDiv.style.alignItems = "center";
    // wordCircleDiv.draggable = "true";
    // document.addEventListener("mouseup", (event) => {
    //   isDragging = false;
    // });

    // 디브에 워드를 달아둔다음에
    wordCircleDiv.addEventListener("mousedown", (event) => {
      isDragging = true;
      // 현재 다운된걸 전역변수로 넣어주고
      wordTarget = wordCircleDiv.id;
      // 시작위치를 저장해둔다.
      startPosX = event.clientX - wordCircleDiv.offsetLeft;
      startPosY = event.clientY - wordCircleDiv.offsetTop;

      // console.log(wordTarget);
    });

    let animeCircle = parent.appendChild(wordCircleDiv);
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

// 곰 애니메이션 함수.
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
  bearCSS.height = "45vh";
  bearCSS.borderRadius = "220px 220px 0 0";
  bearCSS.backgroundColor = "white";

  parent.appendChild(bear);

  // 몸체에 단어가 들어오게된다면
  // bear.addEventListener("dragover", (event) => {
  //   event.preventDefault();
  // });
  // // 들어오는건데 착각하고 있었네.
  // bear.addEventListener("drop", (event) => {
  //   console.log(
  //     `drop zone X: ${event.target.clientX} drop zone Y : ${event.target.clientY}`
  //   );
  // });

  // 손 박스
  const handContainer = document.createElement("div");
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
  phizContainerDiv = phizContainer.id;
  // console.log(phizContainerDiv);

  // bear영역에 왔다면
  bear.addEventListener("mouseover", (event) => {
    // wordTarget이 정해져있다면 over 되었을때 해당 리스트에 서삭제하고
    // 그리고 노드도 삭제
    if (wordTarget != null && isDragging) {
      console.log("bear!");
      console.log(wordTarget);
      let targetDiv = document.getElementById(wordTarget);
      let targetParent = targetDiv.parentNode;

      // prompt 리스트에다가 텍스트를 추가
      if (prompt.includes(targetDiv.innerText) == false) {
        prompt.push(targetDiv.innerText);
      }

      console.log(prompt);

      // targetDiv.animate(
      //   [
      //     { transform: "scale(1.2)" },
      //     { transform: "scale(1.0)" },
      //     { transform: "scale(0.8)" },
      //     { transform: "scale(0.5)" },
      //     { transform: "scale(0.2)" },
      //   ],
      //   {
      //     duration: 200,
      //     fill: "forwards",
      //   }
      // );

      targetParent.removeChild(targetDiv);

      // 뭔가 bear가 들어올때 애니메이션을 추가하고 싶은데.

      // wordTarget을 null로 하지 않는다면 over 상태에서 계속 이벤트가 지속됨.
      // 왜냐하면 removechild를 통해서 부모로부터 해당 자식요소를 지우면 요소가 없는 null상태가 되는데
      // 이때 null상태에서 드래깅중이고 over영역안에 들어와있기 때문에 오류가 나는것
      wordTarget = null;
    }
  });
}

// 마우스 트랙킹 함수.
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

  // mouse x, y좌표에 따라서 눈과 몸통이 이동.
  interact(event, mouse, mouseCenter);
}

// 곰과 마우스간 상호작용 하는 애니메이션 계산 함수.
function interact(e, mouse, mouseCenter) {
  // let limitContainer = document.getElementById("bear");
  let faceContainer = document.getElementById("faceContainer");
  let nose = document.getElementById("nose");
  let ears = document.querySelectorAll(".ears");
  let bearMouse = document.getElementById("mouse");
  let hands = document.querySelectorAll(".hand");
  // console.log(ears);

  var eyeSize = 20,
    eyeSizeRate = 12,
    noseMoveRate = 2.5,
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

  // 얼굴 비율 조절
  translate(faceContainer, dx * 0.2, dy * 0.2);

  // 귀 비율 조절
  for (let i = 0; i < ears.length; i++) {
    translate(ears[i], -dx / earMoveRate, -dy / earMoveRate);
  }

  // 손 비율 조절
  for (let i = 0; i < hands.length; i++) {
    translate(hands[i], -dx / handMoveRate, -dy / handMoveRate);
  }

  // 코비율 조절
  translate(nose, dx * 0.2, dy * 0.2);
  translate(nose, dx * 0.2, dy * 0.2);
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

  // console.log(`${dx}, ${dy}`);
  // 음영 비율 조절
  translate(phizContainer, dx / noseMoveRate, dy / noseMoveRate);
}

// 위치 이동 함수.
function translate(selector, x, y) {
  selector.style.transform = "translate(" + x + "px," + y + "px)";
}

// 입 크기 증가 함수.
function scale(selector, scale) {
  selector.style.transform = `scale(${scale})`;
}

// 단어 드래깅 함수.
document.addEventListener("mousemove", (event) => {
  // 드래깅이 감지되었고 target이 설정되어있다면
  if (isDragging && wordTarget != null) {
    let s = document.getElementById(wordTarget);
    // let rect = s.getBoundingClientRect();
    // console.log(`${rect.left}, ${parseInt(rect.top)}`);

    let xPos = event.clientX - startPosX;
    let yPos = event.clientY - startPosY;

    // console.log(`${xPos}, ${parseInt(yPos)}`);
    s.style.left = xPos + "px";
    s.style.top = parseInt(yPos) + "px";
  }
  // console.log(`${event.clientX}, ${event.clientY}`);
});

// 단어에서 드래깅이 풀렸을때 함수.
document.addEventListener("mouseup", () => {
  if (isDragging == true) {
    isDragging = false;
    wordTarget = null;
  }
});

// 애니메이션에 추가한 단어 확인 함수.
checkWord.addEventListener("mouseover", ()=>{
    if(wordList.length != 0 && checkWord.innerText == "클릭") {
      checkWord.innerText = prompt.join(" ");
    } else if (wordList.length == 0 && checkWord.innerText == "클릭") {
      checkWord.innerText = "아무것도 없어요!";
      checkWord.classList.add("hover-effect");
      checkWord.style.width = checkWord.style.width;
    }
});
// 워드 리스트 영역에서 벗어났을때 함수.
checkWord.addEventListener("mouseout", () => {
    checkWord.innerText = "클릭";
});