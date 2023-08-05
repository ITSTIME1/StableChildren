import { wordArea, completeBtn, title, handDetectionURL} from "../constants/constant.js";

let wordList = [];

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
  // 워드를 입력하지 않았을때
  // go 버튼이 보이지 않도록
  if (wordArea.length == 0) {
    completeBtn.style.visibility = "hidden";
  } else {
    // go버튼이 보이는 경우는 textArea에 작성되는 단어의 길이가 0이 아닐떄
    // 그런 상황에서 enter키를 누르게 된다면 공백검사를 한다. (해당 단어에 대해서)
    completeBtn.style.visibility = "visible";
    let whitespaceRegex = /^\s*$/;
    // 줄바꿈 문자가 있다면 줄바꿈 문자를 제거
    let word = wordArea.value.replace(/\n/g, "");
    // 단어의 길이가 0이 아닌 상황에서 enter키를 누르게 된다면
    if (event.key === "Enter") {
      // 해당 단어의 공백을 검사하고 공백이 있다면 함수를 종료한다.
      if (whitespaceRegex.test(word)) {
        return;
      }
      // shift 키를 누르지 않은 상태에서 단어가 다 끝났다면.
      // 해당 단어를 넣게 되는데 해당 단어가 중복이 되지 않도록한다.
      // 즉 wordList에 중복되는 단어가 없는 경우만 추가한다.
      if (
        event.isComposing === false &&
        !event.shiftKey &&
        !wordList.includes(word)
      ) {
        wordList.push(word);
        console.log(wordList);
      } else if (event.isComposing == true) {
        return;
      }
      // 기본 enter키 동작 새줄로 이동을 취소함.
      event.preventDefault();
      wordArea.value = "";
    } else if (event.key === "Backspace") {
      if (wordList.length != 0) {
        completeBtn.style.visibility = "visible";
      } else {
        completeBtn.style.visibility = "hidden";
      }
    }
  }
});

// go 버튼을 누르게 되면 새로운 페이지를 가져오게 함.
// 이렇게 함으로써 새로운 페이지가 로드되는거지.
completeBtn.addEventListener("click", async () => {
  // hand_detection 페이지 요청
  // 로컬 스토리지를 활용해서 wordList를 저장
  localStorage.setItem("wordList", JSON.stringify(wordList));
  console.log(localStorage.getItem("wordList"))
  window.location.href = 'hand_detection_page/';
});
