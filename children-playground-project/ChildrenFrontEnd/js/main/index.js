import { get_generated_image } from "../api/get_generated_image.js";
import { adjust_image } from "./manage.js";
// import { total } from "./api/get_generated_image.js";
// import { circleSection } from "../animation/animation.js";
import {
  wordArea,
  toggleBtn,
  gausianScreen,
  completeBtn,
  title,
  gausian1,
  gausian2,
  gausian3,
  gausian4,
  hoverSound,
} from "../constants/constant.js";

/**
 * @duplicate = 중복방지 체크
 * @wordList = 추가된 단어 리스트 목록
 */

const loadingPage = document.getElementById("loading");
let createBtn = null;
// 중복 div 방지
let duplicate = false;
export let wordList = [];
export let imageModel = null;
export let generate_image_path = [];
// imageModel 선택시 api 호출 가능 여부
// (imageBulb를 재 클릭하기 때문에 모델을 선택했다면 api 호출을 가능 하도록 해야됨)
let isModel = false;



// 제목을 입력하기 위한 함수.
title.addEventListener("click", (event) => {
  let str = event.target.innerText;
  // console.log(str);
  if (str == "오늘 읽을 책을 알려줘!") {
    let result = window.prompt("무슨책이야?");
    event.target.innerText = result;
    // console.log(result);
  }
});

// 텍스트 입력 필드 관련 함수.
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
    } else {
      return;
    }
    event.preventDefault();
    wordArea.value = "";
  }

  // backspace를 눌렀을때 워드리스트에 단어가 0개가 아니라면
  // 계속 보이게 한다.
  if (event.key === "Backspace") {
    if (wordList.length != 0) {
      completeBtn.style.visibility = "visible";
    } else {
      completeBtn.style.visibility = "hidden";
    }
  }
});

// 토글 버튼 함수
toggleBtn.addEventListener("click", () => {
  const fileName = toggleBtn.src.split("/").pop();

  if (fileName == "polar-black.svg") {
    toggleBtn.src = "../src/images/polar-not-black.svg";
    for (let i = 0; i < gausianScreen.length; i++) {
      gausianScreen[i].style.visibility = "hidden";
    }
  } else {
    toggleBtn.src = "../src/images/polar-black.svg";
    for (let i = 0; i < gausianScreen.length; i++) {
      gausianScreen[i].style.visibility = "visible";
    }
  }
});

// Go 버튼 누를시 애니메이션 생성 및 제목 삭제 후 이미지 생성 버튼 추가 함수.
completeBtn.addEventListener("click", () => {
  // 1. image-section안에 있는 four-image-section을 숨긴다.
  // 2. div를 image-section에 추가
  // 3. 단어들을 뿌리는 효과를 생성.
  const imageBox = document.querySelectorAll(".image-box");
  const footerFormSection = document.querySelector(".form-section");
  const imageSection = document.querySelector(".image-section");
  const navSection = document.getElementById("nav-id");
  const mainContent = document.getElementById("main");


  // 제목 영역을 삭제하고 그림만들어줘!
  const bookSection = document.querySelector(".book-title");
  const titleSection = document.getElementById("title");

  mainContent.style.backgroundColor = "rgb(88, 190, 223)";
  navSection.style.backgroundColor = "rgb(88, 190, 223)";
  bookSection.style.display = "none";

  createBtn = document.createElement("img");
  createBtn.setAttribute("id", "create-btn");

  createBtn.src = "../src/images/lightOFF.png";
  createBtn.alt = "lightBulb";
  createBtn.style.width = "80px";
  createBtn.style.height = "80px";

  // 생성 버튼을 누르면 stable diffusion이랑 연결됨
  // 생성 버튼을 클릭할때
  createBtn.addEventListener("click", async () => {
    mainContent.style.backgroundColor = "#a0e1ff";
    navSection.style.backgroundColor = "#a0e1ff";
    hoverSound.play();

    // 이미지 스타일을 선택
    image_style_choice();

    if (isModel) {
      try {
        // 이미지 생성
        loadingPage.style.display = "block";
        await get_generated_image(wordList, imageModel).then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            const path = `data:image/png;base64,${response.data}`;
            generate_image_path.push(path);
            console.log(generate_image_path);

            // 교사가 먼저 확인해야 되기 때문에 교사 관리자 페이지를 하나 만들어서
            // 그 부분에 먼저 확인을 시키자.
            // manage.html에 먼저 이미지를 적용시키기 위해서 manage.html에 우선적으로 받아온 image들을 적용한다.
            // manage.html에서 교사의 승인이 되기 전까지는 대기한다.
            // 이후에 manage.html에서 모두 승인이 이루어진다면 모든 이미지들을 표시한다.
            // 이후 부분적으로 수정해야될 부분이 있다면 해당 이미지를 선택하고 재생성 버튼을 클릭한다.
            // 일부 부분이 수정되는 api를 따로 하나 만들어서
            // batch_size = 1로 설정된 해당 이미지의 prompt 정보와 image_style을 그대로 넘긴다.
            // 이후 수정이 완료된 사진을 받았다면 해당 사진을 수정한 부분의 image-id에 다시 적용한다.


            // 교사 manage.html 페이지에서 승인이 될 때까지 기다려야하며
            // 교사가 모두 승인을 하지 않았을 경우에는 새로운 api로 호출하는데 이때 필요한건 word_list와 image_style
            // 해당 프롬포트 기반으로 다시 생성한다.
            if (generate_image_path.length == 1) {

              // 3초 후에 page_move_check()실행
              setTimeout(() => {
                // manage.html 에 이미지를 먼저 적용
                // adjust에서 1초단위로 확인을 하고
                // 근데 그래도 확인을 하든 안하든 해당 함수가 전부 실행되고 나서 함수가 종료되면
                // if문을 돌게 되니까
                const confirm = adjust_image();

                if (confirm) {
                  loadingPage.style.display = "none";
                } else {
                  console.log("취소");
                }

                
              }, "3000");


              const imageBox = document.querySelectorAll(".image-box");
              
              const imageSlide = document.querySelectorAll(".image-slide");
              const generateImageSection =
                document.querySelectorAll(".generate-image");

              // imageSlide 부분을 감춰준다.
              for (let i = 0; i < imageSlide.length; i++) {
                imageSlide[i].style.display = "none";
              }

              // 이미지가 들어온 만큼 보여준다.
              for (let i = 0; i < generate_image_path.length; i++) {
                imageBox[i].style.display = "block";
                // 받은 이미지를 generatedImage 부분에 src를 바꿔줌
                let path = generate_image_path[i];
                generateImageSection[i].src = path;
              }
            }
          }
        });
      } catch (error) {
        console.error("에러발생: ", error);
      } finally {
        isModel = false;
      }
      
    }
  });
  // 호버가 된다면 전등을 켜는 이미지로 변경.
  // 효과음 오디오 요소를 선택합니다.
  createBtn.addEventListener("mouseover", (event) => {
    createBtn.src = "../src/images/lightON.png";
    createBtn.style.width = "110px";
    createBtn.style.height = "110px";
  });

  // 호버가 풀린다면 전등을 끄는 이미지로 변경.
  createBtn.addEventListener("mouseout", (event) => {
    createBtn.src = "../src/images/lightOFF.png";
    createBtn.style.width = "80px";
    createBtn.style.height = "80px";
  });

  titleSection.appendChild(createBtn);

  // textArea.style.display = "none";
  // completeBtn.style.display = "none";
  footerFormSection.style.display = "none";
  imageSection.style.height = "100%";
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
    circleSection(wordList);
  }
});

// 나중에 foreach로 gausian 객체에 한번에 리스너를 달아줘야겠다.
// 가우시안 제거 할때 아이콘 제거 함수
// @TODO 리팩토링 필요
gausian1.addEventListener("mouseover", () => {
  gausianIconRemover(gausian1.getElementsByTagName("img")[0]);
});

gausian1.addEventListener("mouseout", () => {
  gausianIconCreater(gausian1.getElementsByTagName("img")[0]);
});

gausian2.addEventListener("mouseover", () => {
  gausianIconRemover(gausian2.getElementsByTagName("img")[0]);
});

gausian2.addEventListener("mouseout", () => {
  gausianIconCreater(gausian2.getElementsByTagName("img")[0]);
});

gausian3.addEventListener("mouseover", () => {
  gausianIconRemover(gausian3.getElementsByTagName("img")[0]);
});

gausian3.addEventListener("mouseout", () => {
  gausianIconCreater(gausian3.getElementsByTagName("img")[0]);
});

gausian4.addEventListener("mouseover", () => {
  gausianIconRemover(gausian4.getElementsByTagName("img")[0]);
});

gausian4.addEventListener("mouseout", () => {
  gausianIconCreater(gausian4.getElementsByTagName("img")[0]);
});

// icon 숨기기 함수.
function gausianIconRemover(target) {
  target.style.visibility = "hidden";
}

// icon 보이기 함수.
function gausianIconCreater(target) {
  target.style.visibility = "visible";
}

// 모델을 선택하는데 모델을 선택할때 다른 변수를 보내주어야 할거 같음근데

// 이미지 스타일 선택.
function image_style_choice() {
  const fourImageSection = document.querySelector(".four-image-section");
  const divScreen = document.getElementById("Div1");
  // 부모노드에 div 스크린이 있다면 지워주고
  if (fourImageSection.contains(divScreen)) {
    // 현재 부모노드에 슬라이드 이미지를 생성할 것.
    divScreen.parentNode.removeChild(divScreen);
    model_image_slider(fourImageSection);
  } else {
    console.log("s");
  }
  // divScreen.style.backgroundColor = "rgba(60, 60, 60, 10)";
}

// 모델 이미지를 보여주고 선택할 슬라이드를 구현.
function model_image_slider(node) {
  const image_list = [
    "../src/images/anime.png",
    "../src/images/manmaru_mix_image.jpeg",
  ];

  let slide_object = [];
  for (let i = 0; i < 2; i++) {
    const slide = document.createElement("slider");
    slide.setAttribute("id", `slide${i + 1}`);
    slide.style.width = "20%";
    slide.style.justifyContent = "center";
    slide.style.alignItems = "center";
    slide.style.textAlign = "center";
    slide.style.boxSizing = "border-box";
    slide.style.height = "70%";
    slide.style.position = "relative";
    slide.style.margin = "50px";
    slide.style.borderTopLeftRadius = "30px";
    slide.style.borderTopRightRadius = "30px";
    slide.style.borderBottomLeftRadius = "30px";
    slide.style.borderBottomRightRadius = "30px";
    slide.style.backgroundColor = "rgba(60, 60, 60, 10)";
    slide.style.display = "flex";

    slide.classList.add("image-slide");
    slide.setAttribute("id", i);

    slide_object.push(slide);
  }
  // console.log(slide_object);
  // slide object를 만들어주고
  // slide object에 image object를 생성해서 넣어준다.
  for (let idx in slide_object) {
    const imageSrc = document.createElement("img");
    imageSrc.src = image_list[idx];
    imageSrc.style.position = "absoulte";
    imageSrc.style.width = "100%";
    imageSrc.style.height = "100%";
    imageSrc.style.objectFit = "cover";
    imageSrc.style.borderTopLeftRadius = "30px";
    imageSrc.style.borderTopRightRadius = "30px";
    imageSrc.style.borderBottomLeftRadius = "30px";
    imageSrc.style.borderBottomRightRadius = "30px";
    slide_object[idx].appendChild(imageSrc);
    node.appendChild(slide_object[idx]);
  }

  for (let obj of slide_object) {
    // 클릭했을때 가우시안을 추가하고 텍스트 설명을 추가 어떤 느낌인지
    // @TODO 여기서부터 해야되겠다. 2023.07.15
    // 이제 버튼을 달고 선택과 해제를 통해서
    // 해당 모델을 선택했으면 스타일이 선택되었다고 알려주고 다른 버튼이나 bulb가 켜진 상태로 변경하며
    // 그 버튼을 눌렀을때
    // 이미지를 생성하기 위해 api호출을 하고
    // api호출을 하고 나면 이미지를 받을때까지 로딩 아이콘을 띄우며
    // 해당 slide부분을 지우고 다시 보이게 한다. 이미지를 받아온 즉시 image_box부분들을 전부 다시 visibility를 다시 보이게하여
    // 그런다음 거기에 있는 imagebox에 이미지를 전부 src로 받아주면서
    // imagebox를 클릭할시 이미지가 가운데로 오면서 커지는 효과를 만들어 준다면 프로그램을 완성할 수 있을 것 같다.

    // 이후 프로그램의 다른 기능들을 천천히 추가시키면 더 좋을것 같음.
    obj.addEventListener("click", () => {
      const dscr = document.createElement("div");
      const dscrScreen = document.createElement("div");
      const dscrScreenText = document.createElement("div");
      const dscrScreenButton = document.createElement("button");

      dscr.setAttribute("id", "dscrFilter");
      dscrScreen.setAttribute("id", "dscrScreen");
      dscrScreenText.setAttribute("id", `${obj.id}-dscrText`);
      dscrScreenButton.setAttribute("id", "dscrButton");

      // 여기서 분기처리
      // 클릭했을때 slide id에 따라서
      // 다른 텍스트를 부여

      // 가우시안 css
      dscr.style.display = "flex";
      dscr.style.fontSize = "0.9rem";

      dscr.style.color = "white";
      dscr.style.position = "absolute";
      dscr.style.justifyContent = "center";
      dscr.style.alignContent = "center";
      dscr.style.textAlign = "center";
      dscr.style.borderTopLeftRadius = "30px";
      dscr.style.borderTopRightRadius = "30px";
      dscr.style.borderBottomLeftRadius = "30px";
      dscr.style.borderBottomRightRadius = "30px";
      dscr.style.width = "100%";
      dscr.style.height = "100%";
      dscr.style.backgroundColor = "rgba(0,0,0,0.5)";
      dscr.style.backdropFilter = "blur(5px)";

      // 가우시안안에 있는 부모 div
      dscrScreen.style.width = "100%";
      dscrScreen.style.height = "100%";
      dscrScreen.style.display = "flex";
      dscrScreen.style.flexDirection = "column";
      dscrScreen.style.justifyContent = "center";
      dscrScreen.style.alignItems = "center";
      dscrScreen.style.textAlign = "center";
      dscrScreen.style.position = "relative";

      // 가우시안 안에 있는 텍스트
      dscrScreenText.style.width = "50%";
      dscrScreenText.style.height = "auto";
      dscrScreenText.style.position = "absoulte";

      switch (obj.id) {
        case "0":
          dscrScreenText.innerText =
            "판타지 스러운 분위기는 어때요? 정말 딱일 것 같은데요?";
          break;
        case "1":
          dscrScreenText.innerText = "너무 따듯해요.";
      }

      // 가우시안 안에 있는 선택 버튼
      dscrScreenButton.style.marginTop = "30px";
      dscrScreenButton.style.border = "none";
      dscrScreenButton.style.cursor = "pointer";
      dscrScreenButton.style.background = "none";
      dscrScreenButton.style.backgroundColor = "cyan";
      dscrScreenButton.style.borderRadius = "50px";
      dscrScreenButton.style.width = "20%";
      dscrScreenButton.style.height = "5%";
      dscrScreenButton.style.color = "black";
      // dscrScreenButton.style.position = "absolute";
      dscrScreenButton.innerText = "선택";

      // 선택버튼을 클릭했을때
      // imageSrc를 바꿔보자
      dscrScreenButton.addEventListener("click", () => {
        model_choice(obj.id);
      });

      dscrScreen.appendChild(dscrScreenText);
      dscrScreen.appendChild(dscrScreenButton);
      dscr.appendChild(dscrScreen);

      const getDscr = document.getElementById("dscrFilter");
      // 가우시안이 없다면 가우시안을 추가.
      if (!obj.contains(getDscr)) {
        obj.appendChild(dscr);
      } else {
        getDscr.parentNode.removeChild(getDscr);
      }
    });

    // 마우스가 포커스를 잃었을때 가우시안이 남아있다면 해제
    obj.addEventListener("mouseleave", () => {
      const getDscr = document.getElementById("dscrFilter");
      if (obj.contains(getDscr)) {
        getDscr.parentNode.removeChild(getDscr);
      }
    });
  }
}

// 이미지 스타일 선택
function model_choice(id) {
  // 이미지 모델은 두개
  // Anime 모델과 ManMaru
  switch (id) {
    case "0":
      console.log(id);
      imageModel = "Anime";
      // console.log("Daemonstrate Model");
      break;
    case "1":
      console.log(id);
      imageModel = "Manmaru";
      // console.log("Manmaru Model");
      break;
  }
  // 이미지를 선택했다면 전구 이미지를 바꿈
  const getCreateBtn = document.getElementById("create-btn");
  getCreateBtn.src = "../src/images/lightON.png";
  // 모델을 선택했다고 알려주는데
  isModel = true;
  // console.log(imageModel);
}
