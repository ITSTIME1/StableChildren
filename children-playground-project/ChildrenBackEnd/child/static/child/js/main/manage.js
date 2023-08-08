// 여기에서 값을 클릭했을때
// 페이지에서 base64 리스트가 채워진걸 계속 확인한다.
import {regenerate_image} from "../api/stablediffusion_api.js";


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
       * @TODO 2023.8.8일
       * 관리자에서 승인시 이동 구현. (okay).
       * 이미지 4개 받아서 보여주는 기능 테스트 (okay).
       * 특정 이미지 재생성 함수 구현. (okay)
       * 특정 이미지 재생성 후 서버에서 다시 받아 교사가 확인한 뒤 원래 있었던 index에 넣어줌. (base64Url상에서 넣어야함.) 따라서 base64배열 구조가 달라지기 때문에 (okay)
       * base64배열에서 원래 index를 삭제하고 현재 받아온 base64인코딩 값으로 대체. (okay)
       * 이후 storage에 다시 저장. (ok)
       * 재생성 버튼을 클릭하면 선택한 가우시안이 전부 해제. 이후 해당 프롬포트를 가지고 다시 재생성. (ok)
       * mediapipe pythond에서 javascript로 변경 jsDeliver사용해서 cdn으로 서버에서 제공해주게끔 하는게 좋을거 같음.
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
      console.log(re_generated_image);
    });
  }
}

// 이미지를 지속적으로 관찰.
function checkBase64() {
  console.log("base64 url 체크");
  // json 문자열을 object로 다시 바꿔준다. 
  let result = JSON.parse(localStorage.getItem("base64ImageUrl"));
  console.log(result);
  if (result != null) {
    for (let i = 0; i < result.length; i++) {
      // image_section
      image_section[i].src = `data:image/png;base64,${result[i]}`;
    }
  }
}

// 모두 승인 버튼
// 전체적으로 사진을 승인한다.
const agreeBtn = document.getElementById("agree");
agreeBtn.addEventListener("click", () => {
  let check = window.confirm("정말로 모두 승인 하시겠습니까?");
  if (check === true) {
    localStorage.setItem("confirm", "true");
  } else {
    localStorage.setItem("confirm", "false");
  }
});


// 재생성 버튼
// 선택되어져 있는 것들을 재생성 할건데
// 특정 이미지를 다시 그리는게 없다보니까
// 음 인페인팅 기능을 추가하기 보다는 이건 나중에 부가적인 기능으로 취급하고
// 이미지를 재생성하는 걸로 하자.
// 이미지를 재생성하는 것이기 떄문에 해당 원래 프롬포트와 imageModel을 가지고 다시 재생성 함수를 통해서
// 재성성을 진행할거고 그걸 받게 되면 저장해두었던 인덱스에다가 이미지를 변경.
const regenerateBtn = document.getElementById("regenerate");
regenerateBtn.addEventListener("click", async ()=>{
  console.log("regenerate");
  // batch_size를 선택한것 만큼 적용.
  // 배치사이즈를 같이 보내준다.
  let prompt = JSON.parse(localStorage.getItem("wordList"));
  let imageModel = JSON.parse(localStorage.getItem("imageModel"));
  let base64ImageUrl = JSON.parse(localStorage.getItem("base64ImageUrl"));


  console.log(prompt);
  console.log(imageModel);
  // regenerate 함수를 호출하여 이미지를 재생성
  // prompt, model, batch_size
  await regenerate_image(prompt, imageModel, (re_generated_image.length)).then((response)=>{
      // 200을 받고 다음 처리할 작업은
      // 선택했던 이미지에 이미지를 다시 적용
      // response에 url을 주니까
      // 개수만큼 받아올것이기 때문에 
      console.log(response.data);
      alert("이미지가 도착했습니다!");
      for (let i = 0; i < re_generated_image.length; i++) {
        // 재생성 이미지에 인덱스가 있으니까
        // 그 인덱스를 가지고 와서 해당 번호의 image_section에 적용
        // 이제 해당 이미지가 새롭게 받아 왔으니까
        // 선택한 re_generated_image[i]-1번 인덱스에다가 로컬스토리지도 변경해줘야함
        base64ImageUrl[re_generated_image[i]-1] = response.data["regenerate_base64_image"][i];
        image_section[re_generated_image[i]-1].src = `data:image/png;base64,${response.data["regenerate_base64_image"][i]}`;
        // 적용후 해당 가우시안 스크린 해제
        const getCheckScreen = document.getElementById(`check-screen-${(re_generated_image[i])}`);
        teacher_generated_box[re_generated_image[i]-1].removeChild(getCheckScreen);
      }
      localStorage.setItem("base64ImageUrl", JSON.stringify(base64ImageUrl));
      re_generated_image = [];
      // test
      // const getCheckScreen = document.getElementById(`check-screen-3`);
      // teacher_generated_box[2].removeChild(getCheckScreen);
  });

  console.log(`${re_generated_image.length} 만큼 체인지 할 것.`);
});

checkBase64();
image_select();
setInterval(checkBase64, 10000);

