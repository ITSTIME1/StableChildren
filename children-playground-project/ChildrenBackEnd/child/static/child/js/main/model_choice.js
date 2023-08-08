import { generate_image } from "../api/stablediffusion_api.js";

const slide = document.querySelectorAll(".model-choice-slide");
const getImagebulb = document.querySelector(".model-choice-icon");
let base64ImageUrlList = [];
let imageModel = null;

for (let i = 0; i < slide.length; i++) {
  slide[i].addEventListener("click", (event) => {
    const gausianScreen = document.createElement("gausian");
    gausianScreen.setAttribute("id", `gs-${event.target.id}`);
    gausianScreen.style.position = "absolute";
    gausianScreen.style.padding = "15px";
    gausianScreen.style.width = "100%";
    gausianScreen.style.height = "100%";
    gausianScreen.style.borderRadius = "30px";
    gausianScreen.style.backgroundColor = "rgba(0,0,0,0.5)";
    gausianScreen.style.backdropFilter = "blur(10px)";
    gausianScreen.style.display = "flex";
    gausianScreen.style.justifyContent = "center";
    gausianScreen.style.alignItems = "center";
    gausianScreen.style.textAlign = "center";
    gausianScreen.style.color = "white";
    gausianScreen.style.fontSize = "1rem";

    if (event.target.id === "s1") {
      gausianScreen.innerText =
        "화창한 봄날, 따스한 햇살\n기분이 좋아질 것 같은데요?";
    } else {
      gausianScreen.innerText =
        "전통적인 느낌이 굉장히 많이 느껴져요!\n이것도 궁금해 지는데요?";
    }

    // blur가 존재하지 않을때만 추가
    // 만약 blur가 존재한다면 제거.
    // 선택이 되었을때 imageModel을 선택.
    if (slide[i].hasChildNodes() === false) {
      slide[i].appendChild(gausianScreen);
      if (event.target.id === "s1") {
        imageModel = "manMaru";
      } else {
        imageModel = "anime";
      }
      console.log(imageModel);
    } else {
      // slide에 있는 가우시안 및 자식노드를 전부 삭제.
      slide[i].innerHTML = "";
      imageModel = null;
    }
  });
}

getImagebulb.addEventListener("click", async () => {
  // imageModel이 null이 아니라면 모델을 선택했기 때문에 get_image함수를 실행.
  if (imageModel !== null) {
    // 이미지 생성 api 호출.
    let array = JSON.parse(localStorage.getItem("wordList"));
    // 이게 형식이 object다 보니까
    // 리스트로 변환해서 저장하는게 필요할거 같은데
    // 그럼 여기서 리스트에다가 base64인코딩 문자열을 넣어놓고
    // 4개가 되었을때 로컬 스토리지에 json 문자열로 저장하고
    // main으로 이동했을때 json 객체값들을 전부 가져와서 넣어주면 되겠다.
    await generate_image(array, imageModel).then((response) => {
      // base64인코딩 문자열들을 저장해놓고
      console.log(response);

      // base64 string을 JSONresponse로 받아 키값으로 데이터를 가져온다음
      // 타입이 object기 떄문에 바로 넣으면 안되고 object에 있는 값들을 가지고
      // base64생성 모델에 넣어둔다.
      let result = response.data["imagesByteString"];
      if (result.length !== 0) {
        for (let i = 0; i < result.length; i++) {
          base64ImageUrlList.push(response.data["imagesByteString"][i]);
        }
        // base64리스트에 이미지가 2개가 다 모였다면
        // 로딩 페이지로 이동하고 이걸 localStorage에 저장해준다.
        if (base64ImageUrlList.length === 4) {
          // obejct형식으로 만들어서 저장.
          localStorage.setItem(
            "base64ImageUrl",
            JSON.stringify(base64ImageUrlList)
          );
          // 생성한 imageModel도 저장해준다.
          localStorage.setItem("imageModel", JSON.stringify(imageModel));
          // 이전 기록은 지워준다.
          base64ImageUrlList = [];
        }
        console.log(base64ImageUrlList.length);
      }
      window.location.href = "loading_page/";
    });
  } else {
    alert("스타일을 선택해 주세요!");
  }
});
