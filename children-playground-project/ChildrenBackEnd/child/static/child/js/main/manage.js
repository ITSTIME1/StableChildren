// 여기에서 값을 클릭했을때
// 페이지에서 base64 리스트가 채워진걸 계속 확인한다.
const image_section = document.querySelectorAll(".check-image");
const teacher_generated_box = document.querySelectorAll(
  ".teacher-generated-box"
);

let re_generated_image = [];

function image_select() {
  for (let i = 0; i < teacher_generated_box.length; i++) {
    // 클릭하면 체크목록에 다시 변환
    teacher_generated_box[i].addEventListener("click", (event) => {
      const checkScreen = document.createElement("check-screen");
      checkScreen.setAttribute("id", `check-screen-${i + 1}`);
      checkScreen.style.position = "absolute";
      checkScreen.style.padding = "15px";
      checkScreen.style.width = "100%";
      checkScreen.style.height = "100%";
      checkScreen.style.borderRadius = "30px";
      checkScreen.style.backgroundColor = "rgba(0,0,0,0.5)";
      checkScreen.style.backdropFilter = "blur(10px)";
      checkScreen.style.display = "flex";
      checkScreen.style.justifyContent = "center";
      checkScreen.style.alignItems = "center";
      checkScreen.style.textAlign = "center";
      checkScreen.style.color = "white";
      checkScreen.style.fontSize = "1rem";
      checkScreen.innerText = `${i+1}번 이미지를 선택 하셨습니다.`;

      // 현재 체크 스크린이 없다면 추가해주고
      // 있다면 제거해준다.
      let checkScreenID = `check-screen-${i + 1}`;
      let check = teacher_generated_box[i].querySelector(`#${checkScreenID}`);

      /**
       * @TODO 2023.8.6일
       * 관리자에서 승인시 이동 구현.
       * 관리자 페이지 재생성 하기 위해 이미지 선택 함수 구현.
       * 특정 이미지 재생성 함수 구현.
       * 특정 이미지 재생성 후 서버에서 다시 받아 교사가 확인한 뒤 원래 있었던 index에 넣어줌. (base64Url상에서 넣어야함.) 따라서 base64배열 구조가 달라지기 때문에
       * base64배열에서 원래 index를 삭제하고 현재 받아온 base64인코딩 값으로 대체.
       * 이후 storage에 다시 저장.
       * 재생성 버튼을 클릭하면 선택한 가우시안이 전부 해제. 이후 해당 프롬포트를 가지고 다시 재생성.
       */

      if (!check) {
        // re_generated_image에 해당 인덱스 번호가 없다면 추가.(다시 생성할 인덱스 번호.)
        if (!re_generated_image.includes(i + 1)) {
          re_generated_image.push(i + 1);
        }
        teacher_generated_box[i].appendChild(checkScreen);
      } else {
        const getCheckScreen = document.getElementById(`check-screen-${i + 1}`);
        let index = re_generated_image.indexOf(i + 1);
        re_generated_image.splice(index, 1);

        teacher_generated_box[i].removeChild(getCheckScreen);
      }
    });
  }
}

function checkBase64() {
  console.log("base64 url 체크");
  // json 문자열을 object로 다시 바꿔준다.
  let base64UrlList = JSON.parse(localStorage.getItem("base64ImageUrl"));
  // 4개라면 해당 image_section에 우선적으로 넣어준다.
  if (base64UrlList.length === 1) {
    for (let i = 0; i < 1; i++) {
      // image_section
      image_section[i].src = base64UrlList[i];
      console.log(base64UrlList[i]);
    }
  }
}

const agreeBtn = document.getElementById("agree");
agreeBtn.addEventListener("click", () => {
  let check = window.confirm("정말로 모두 승인 하시겠습니까?");
  if (check === true) {
    localStorage.setItem("confirm", "true");
  } else {
    localStorage.setItem("confirm", "false");
  }
});

checkBase64();
image_select();
// setInterval(checkBase64, 3000);
