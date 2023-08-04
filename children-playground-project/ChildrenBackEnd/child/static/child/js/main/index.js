
import {
  wordArea,
  completeBtn,
  title,
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

  createBtn.style.width = "80px";
  createBtn.style.height = "80px";


  // 이미지 자체도 정적으로 주고 있기 때문에
  // 즉 서버에 저장되어 있는 이미지 파일을 보여주고 있기 때문에
  // 클라이언트에서는 정적파일을 받아보게 된거고
  // 이때 이 정적 파일을 변경하기 위해서 다른 조취를 취해야 하는거 같은데.
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

            // 일단 데이터베이스에 사진을 저장해두고
            // 비동기로 요청을 진행해서 서버에다가 요청
            // 서버 응답을 기다리고 있다가
            // 만약 서버가 응답을 내려주었다면 
            // 이미지를 표시할 수 있도록 
            // 이게 응답을 어떻게 기다릴거냐인데
            // 소켓 처리를 해야되겠네
            // hmm 매우 힘들어지는구만..
            // 일단 페이지를 좀 나누자
            // 1. index.js는 메인페이지에서 구현될 동작들을 설정하고
            // 2. 실제로 hand-detection이 수행될 페이지를 따로 설정하고
            // 3. 이미지를 보여주는 부분을 따로 설계하자.
            // 4. 각각각을 다른 페이지로 만들어서 Url매개변수를 사용해서 생각해보니 모든 단계에서 전부 wordList만 있으면 되네
            // 이미지 스타일을 선택하는건 그 페이지에서 할 일이니까

            // 교사 manage.html 페이지에서 승인이 될 때까지 기다려야하며
            // 교사가 모두 승인을 하지 않았을 경우에는 새로운 api로 호출하는데 이때 필요한건 word_list와 image_style
            // 해당 프롬포트 기반으로 다시 생성한다.
            if (generate_image_path.length == 1) {

              // 3초 후에 page_move_check()실행
              setTimeout(() => {
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
  // // 호버가 된다면 전등을 켜는 이미지로 변경.
  // // 효과음 오디오 요소를 선택합니다.
  // createBtn.addEventListener("mouseover", (event) => {
  //   createBtn.src = "static/child/images/lightON.png";
  //   createBtn.style.width = "110px";
  //   createBtn.style.height = "110px";
  // });

  // // 호버가 풀린다면 전등을 끄는 이미지로 변경.
  // createBtn.addEventListener("mouseout", (event) => {
  //   createBtn.src = "static/child/images/lightOFF.png";
  //   createBtn.style.width = "80px";
  //   createBtn.style.height = "80px";
  // });

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

