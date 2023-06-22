// textarea enter 입력시 해당 단어를 전부 가지고 와서 리스트에 추가
const wordArea = document.getElementById("word-area");
const toggleBtn = document.getElementById("toggle");
const gausianScreen = document.querySelectorAll(".gausian");

// wordList
let wordList = [];

// onKeyDown: keycode 값 - 한/영, Shift, Backsapce 등 인식 가능
// onKeyPress: ASCII 값 - 한/영, Shift, Backsapce 등 인식 불가
wordArea.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        let whitespaceRegex = /^\s*$/;
        let word = wordArea.value;

        // 공백 문자가 들어오는 경우 리스트에 추가되지 않도록
        if (whitespaceRegex.test(word)) {
            event.preventDefault();
            return;
        }
        
        // shift + enter조합막기
        if(event.shiftKey === true && event.key === "Enter") {
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
    }
});



// Document.querySelector()는 제공한 선택자 또는 선택자 뭉치와 일치하는 문서 내 첫 번째 Element를 반환합니다. 일치하는 요소가 없으면 null을 반환합니다.(MDN)
// Document.getElementById() 메서드는 주어진 문자열과 일치하는 id 속성을 가진 요소를 찾고, 이를 나타내는 Element 객체를 반환합니다. ID는 문서 내에서 유일해야 하기 때문에 특정 요소를 빠르게 찾을 때 유용합니다.(MDN)

// 토글 버튼 클릭시 gausian & image icon 삭제
toggleBtn.addEventListener("click", () => {
    // 만약 토글 버튼이 체크되었다면
    // 가우시안 페이지를 전부 걷어냄 이미지와 함께
    if (toggleBtn.checked == true) {
        // console.log(toggleBtn.checked);
        for (let i = 0; i < gausianScreen.length; i++) {
            gausianScreen[i].style.visibility = "hidden";
        }   
    } else {
        // console.log(toggleBtn.checked);
        for (let i = 0; i < gausianScreen.length; i++) {
            gausianScreen[i].style.visibility = "visible";
        }
    }
});

// 완료 버튼 누를시 화면을 새로운 걸로 바꾸고
// 