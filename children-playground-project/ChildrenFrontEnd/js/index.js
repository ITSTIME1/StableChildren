import { get_generated_image } from "./api/get_generated_image.js";
import {circleSection} from "../js/animation/animation.js";

const wordArea = document.getElementById("word-area");
const toggleBtn = document.getElementById("logo-image");
const gausianScreen = document.querySelectorAll(".gausian");
const completeBtn = document.getElementById("complete-btn");
const title = document.querySelector(".book-title");
// 중복 div 방지
let duplicate = false;
// 단어리스트
let wordList = [];

// 제목을 입력하기 위한 함수.
title.addEventListener("click", (event) => {
  let str = event.target.innerText;
  // console.log(str);
  if(str == "오늘 읽을 책을 알려줘!") {
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
      console.log(wordList);
    } else {
      return;
    }
    event.preventDefault();
    wordArea.value = "";
    completeBtn.style.visibility = "hidden";
  }
});

// 이미지 덮개 제거 함수.
toggleBtn.addEventListener("click", () => {
  const fileName = toggleBtn.src.split('/').pop();
  // imagePath.svg만 추출
  console.log(fileName);

  if(fileName == "polar-black.svg") {

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
  
  // 제목 영역을 삭제하고 그림만들어줘!
  const bookSection = document.querySelector(".book-title");
  const titleSection = document.getElementById("title");

  bookSection.style.display = "none";

  const createBtn = document.createElement("div");
  createBtn.setAttribute("id", "create-btn");

  console.log(createBtn);
  createBtn.style.width = "100%";
  createBtn.style.height = "100%";
  createBtn.style.backgroundColor = "cyan";
  createBtn.style.borderRadius = "30px 30px 30px 30px";
  createBtn.style.color = "white";
  createBtn.style.display = "flex";
  createBtn.style.justifyContent = "center";
  createBtn.style.alignItems = "center";
  createBtn.style.textAlign = "center";

  const createBtnTxt = document.createTextNode("생성!");
  createBtn.appendChild(createBtnTxt);
  titleSection.appendChild(createBtn);

  // 생성 버튼을 누르면 stable diffusion이랑 연결됨
  createBtn.addEventListener("click", (event)=> {
    get_generated_image(prompt, event);
  });
  
  // 만약 호버한다면 scale커지게

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

