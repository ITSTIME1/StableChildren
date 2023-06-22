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
    circleDiv(fourImageSection);
  }
});


// circle div 함수
function circleDiv(parent) {
  const circleDiv = document.createElement("div");
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
  parent.appendChild(circleDiv);
  circleAnimation(circleDiv);

  // 북극곰 3D 모델링
  polarBear3D(circleDiv);
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
      let y = anime.random(-maxY / 2, maxY / 2) + "px";
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
  const bearCSS = bear.style;
  // bear 몸통
  bearCSS.position = "absolute";
  bearCSS.left = "50%";
  bearCSS.bottom = "0";
  bearCSS.width = "440px";
  bearCSS.height = "370px";
  bearCSS.marginLeft= "-220px";
  bearCSS.borderRadius= "220px 220px 0 0";
  bearCSS.backgroundColor = "white";

  // 귀 위치 잡는 컨테이너
  const bearEearContainer = document.createElement("div");
  const bearEearContainerCSS = bearEearContainer.style;
  bearEearContainerCSS.position = "absolute";
  bearEearContainerCSS.display = "flex";
  bearEearContainerCSS.justifyContent = "space-between";
  bearEearContainerCSS.left = "50%";
  bearEearContainerCSS.top = "35%";
  bearEearContainerCSS.bottom = "0";
  bearEearContainerCSS.width = "530px";
  bearEearContainerCSS.height = "220px";
  bearEearContainerCSS.marginLeft= "-265px";
  // bearEearContainerCSS.backgroundColor="red";

  // 왼쪽 귀
  const bearLeftEar = document.createElement("div");
  const bearLeftEarCSS = bearLeftEar.style;
  bearLeftEarCSS.top = "10px";
  bearLeftEarCSS.width= '120px';
  bearLeftEarCSS.height= '120px';
  bearLeftEarCSS.borderRadius= '50%';
  bearLeftEarCSS.backgroundColor= 'white';

  bearEearContainer.appendChild(bearLeftEar);

  // 오른쪽 귀
  const bearRightEar = document.createElement("div");
  const bearRightEarCSS = bearRightEar.style;
  bearRightEarCSS.top = "10px";
  bearRightEarCSS.width= '120px';
  bearRightEarCSS.height= '120px';
  bearRightEarCSS.borderRadius= '50%';
  bearRightEarCSS.backgroundColor= 'white';
  
  bearEearContainer.appendChild(bearRightEar);


  // 안면 제한 박스
  const limitContainer = document.createElement("div");
  const limitCSS = limitContainer.style;

  limitCSS.position = "absolute";
  limitCSS.left= '50%';
  limitCSS.top= '10%';
  limitCSS.width= '240px';
  limitCSS.height= '270px';
  limitCSS.marginLeft= '-120px';
  limitCSS.backgroundColor="red";

  
  // 얼굴 박스
  const faceContainer = document.createElement("div");
  const faceCSS = faceContainer.style;
  faceCSS.position = "absolute";
  faceCSS.left= '50%';
  faceCSS.top= '6%';
  faceCSS.width= '140px';
  faceCSS.height= '230px';
  faceCSS.marginLeft= '-70px';
  faceCSS.backgroundColor="orange";
  limitContainer.appendChild(faceContainer);

  // 눈 박스
  const eyeContainer = document.createElement("div");
  const eyeContainerCSS = eyeContainer.style;
  eyeContainerCSS.display = "flex";
  eyeContainerCSS.justifyContent = "space-between";
  eyeContainerCSS.position="absolute";
  eyeContainerCSS.left= '50%';
  eyeContainerCSS.width= '82px';
  eyeContainerCSS.height= '20px';
  eyeContainerCSS.marginLeft= '-41px';
  // eyeContainerCSS.backgroundColor="blue";

  // 왼쪽 눈
  const leftEye = document.createElement("div");
  const leftEyeCSS = leftEye.style;

  leftEyeCSS.width = "20px";
  leftEyeCSS.height = "100%";
  leftEyeCSS.borderRadius = "50%";
  leftEyeCSS.backgroundColor="black";


  eyeContainer.appendChild(leftEye);


  // 오른쪽 눈
  const rightEye = document.createElement("div");
  const rightEyeCSS = rightEye.style;

  rightEyeCSS.width = "20px";
  rightEyeCSS.height = "100%";
  rightEyeCSS.borderRadius = "50%";
  rightEyeCSS.backgroundColor="black";

  eyeContainer.appendChild(rightEye);
  faceContainer.appendChild(eyeContainer);
  bearEearContainer.appendChild(limitContainer);


  // 코 음영 
  
  // 코 
  // 입






  // const bear
  parent.appendChild(bear);
  parent.appendChild(bearEearContainer);
}