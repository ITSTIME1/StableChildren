import { regenerate_image } from "../api/stablediffusion_api.js";
/**
 * @TODO 2023.8.8일
 * 관리자에서 승인시 이동 구현. (okay).
 * 이미지 4개 받아서 보여주는 기능 테스트 (okay).
 * 특정 이미지 재생성 함수 구현. (okay)
 * 특정 이미지 재생성 후 서버에서 다시 받아 교사가 확인한 뒤 원래 있었던 index에 넣어줌. (base64Url상에서 넣어야함.) 따라서 base64배열 구조가 달라지기 때문에 (okay)
 * base64배열에서 원래 index를 삭제하고 현재 받아온 base64인코딩 값으로 대체. (okay)
 * 이후 storage에 다시 저장. (okay)
 * 재생성 버튼을 클릭하면 선택한 가우시안이 전부 해제. 이후 해당 프롬포트를 가지고 다시 재생성. (okay)
 * mediapipe pythond에서 javascript로 변경 jsDeliver사용해서 cdn으로 서버에서 제공해주게끔 하는게 좋을거 같음.
 * main에서 승인된 사진 보여주기. (okay)
 * 로그인 페이지를 만들어서 기존에 만들어 두었던 것들을 커뮤니티 형식으로 보여주는 기능도 좋겠다. 한명만 사용하는게 아닌 여러명이 사용한다고 가정한다면
 */

const image_section = document.querySelectorAll(".check-image");
const teacher_generated_box = document.querySelectorAll(
  ".teacher-generated-box"
);
const agreeBtn = document.getElementById("agree");
const regenerateBtn = document.getElementById("regenerate");

let re_generated_image = [];
let isAnimation = false;
let isProcessing = false;

// 재생성할 이미지를 선택.
function image_select() {
  for (let i = 0; i < teacher_generated_box.length; i++) {
    // 클릭하면 체크목록에 다시 변환
    teacher_generated_box[i].addEventListener("click", () => {
      isAnimation = false;
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
      checkScreen.innerText = `${i + 1}번 이미지를 선택 하셨습니다.`;

      // 현재 체크 스크린이 없다면 추가해주고
      // 있다면 제거해준다.
      let checkScreenID = `check-screen-${i + 1}`;
      let check = teacher_generated_box[i].querySelector(`#${checkScreenID}`);

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
      console.log(re_generated_image);
    });
    // 이미지에 마우스를 가져다 대었을때
    // teacher_generated_box[i].addEventListener("mouseover", (event) => {
    //   const scaleTargetImage = document.getElementById(`t${i+1}`);
    //   console.log(scaleTargetImage);
    //   // 가우시안이 있는 상태에서는 이미지를 원본 크기대로 보여주지 않음.
    //   if (event.target.id === `check-screen-${i + 1}`) {
    //     console.log("이러한 경우들");
    //     scaleTargetImage.style.transform = "";
    //     return;

    //   } else {
    //     // 가우시안이 존재하지 않을경우에 마우스를 올렸을때 이미지를 본래 크기로 보여준다.
    //     // 이 전체 window의 너비를 구해보자
    //     let tb = scaleTargetImage.getBoundingClientRect();
    //     // 중간지점에서부터 이미지의 top지점까지 빼고 절반으로 나눈거에 -만큼 이동하면되겠다.

    //     //
    //     // console.log(parent.innerWidth / 2);
    //     // console.log(tb.x);
    //     // console.log(tb.width);
    //     // console.log((((parent.innerWidth / 2) - tb.x)) - tb.width / 2);
    //     // console.log(parseInt(((parent.innerWidth / 2) - tb.top) / 2));

    //     // 아 오케이 이게 왜 되는지 이해가 되었으.
    //     // 애니메이션 중에는 변경되지 않게 함.
    //     // 따라서 애니메이션 이라면 적용하지 않음.
    //     // 뒤죽 박죽이구만 이것도 해결해야 겠다.
    //     if (!isAnimation) {
    //       scaleTargetImage.style.transitionDuration = "2s";
    //       scaleTargetImage.style.transitionTimingFunction = "cubic-bezier(0, 0.76, 0.35, 0.73)";
    //       scaleTargetImage.style.transform = `translateX(${(((parent.innerWidth / 2) - tb.x)) - (tb.width / 2)}px)`;
    //       scaleTargetImage.style.zIndex = "1";
    //       isAnimation = true;
    //     }

    //     // 마우스 업이라면 원래대로
    //     teacher_generated_box[i].addEventListener("mouseleave", () => {
    //       // scaleTargetImage.style.transform = "";
    //       scaleTargetImage.style.zIndex = "";
    //     });
    //   }
    // });
  }
}

// 이미지를 지속적으로 관찰.
function checkBase64() {
  console.log("base64 url 체크");
  // json 문자열을 object로 다시 바꿔준다.
  let result = JSON.parse(localStorage.getItem("base64ImageUrl"));
  if (result != null) {
    for (let i = 0; i < result.length; i++) {
      // image_section
      image_section[i].src = `data:image/png;base64,${result[i]}`;
    }
  }
}

// 이미지를 전체 승인할때
agreeBtn.addEventListener("click", () => {
  let check = window.confirm("정말로 모두 승인 하시겠습니까?");
  console.log(check);
  if (check === true) {
    localStorage.setItem("confirm", "true");
  } else {
    localStorage.setItem("confirm", "false");
  }
});

// 이미지를 재생성 할때
regenerateBtn.addEventListener("click", async () => {
  // 프로세싱 중이 아니면 재생성
  if (!isProcessing) {
    isProcessing = true;
    console.log("regenerate");
    // batch_size를 선택한것 만큼 적용.
    // 배치사이즈를 같이 보내준다.
    let prompt = JSON.parse(localStorage.getItem("wordList"));
    let imageModel = JSON.parse(localStorage.getItem("imageModel"));
    let base64ImageUrl = JSON.parse(localStorage.getItem("base64ImageUrl"));

    await regenerate_image(prompt, imageModel, re_generated_image.length).then(
      (response) => {
        console.log(response.data);
        alert("이미지가 도착했습니다!");

        // 이미지가 정상적으로 왔을때 isProcessing을 다시 돌려놔서 재생성이 가능하도록.
        isProcessing = false;
        for (let i = 0; i < re_generated_image.length; i++) {
          base64ImageUrl[re_generated_image[i] - 1] =
            response.data["regenerate_base64_image"][i];
          image_section[
            re_generated_image[i] - 1
          ].src = `data:image/png;base64,${response.data["regenerate_base64_image"][i]}`;
          // 적용후 해당 가우시안 스크린 해제
          const getCheckScreen = document.getElementById(
            `check-screen-${re_generated_image[i]}`
          );
          teacher_generated_box[re_generated_image[i] - 1].removeChild(
            getCheckScreen
          );
        }
        localStorage.setItem("base64ImageUrl", JSON.stringify(base64ImageUrl));
        re_generated_image = [];
        // test
        // const getCheckScreen = document.getElementById(`check-screen-3`);
        // teacher_generated_box[2].removeChild(getCheckScreen);
      }
    );
    // isPro
    console.log(`${re_generated_image.length} 만큼 체인지 할 것.`);
  } else {
    // 프로세싱 중이면 기다려야 한다고 말해야됨
    alert("이미지를 만들고 있습니다. 기다려야 해요!");
  }
});

image_select();

// 이미지를 받아오기 위해서 10초마다 한번씩 로컬스토리지를 검사하여
// 이미지를 변경한다.
setInterval(checkBase64, 10000);
