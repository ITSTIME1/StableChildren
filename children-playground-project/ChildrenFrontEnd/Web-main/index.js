// textarea enter 입력시 해당 단어를 전부 가지고 와서 리스트에 추가
const wordArea = document.getElementById("word-area");

// wordList
let wordList = [];

// onKeyDown: keycode 값 - 한/영, Shift, Backsapce 등 인식 가능
// onKeyPress: ASCII 값 - 한/영, Shift, Backsapce 등 인식 불가
wordArea.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        let word = wordArea.value;

        // false이면 음절이 딸려오는 문제가 있기 때문에
        // 자음과 모음을 합치는 과정에서 종료되지 않으면 음절이 짤리거나 제대로 가져오지 않는다.
        // 처음에 false 입력중이면 true이기 때문에
        // false인 상태에서 입력을 받아야하고

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



// 토글 버튼 클릭시 gausian & image icon 삭제