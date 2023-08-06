import { get_generated_image } from "../api/get_generated_image.js";

const slide = document.querySelectorAll(".model-choice-slide");
const getImagebulb = document.querySelector(".model-choice-icon");
let base64ImageUrlList = [];
let imageModel = null;

for (let i = 0; i < slide.length; i++ ){
    slide[i].addEventListener("click", (event)=>{ 
        const gausianScreen = document.createElement("gausian");
        gausianScreen.setAttribute("id", `gs-${event.target.id}`)
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
            gausianScreen.innerText = "화창한 봄날, 따스한 햇살\n기분이 좋아질 것 같은데요?";
        } else {
            gausianScreen.innerText = "전통적인 느낌이 굉장히 많이 느껴져요!\n이것도 궁금해 지는데요?";
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

        await get_generated_image(array, imageModel).then((response)=>{
            // base64인코딩 문자열들을 저장해놓고
            base64ImageUrlList.push(response.data);
        });

        /**
         * @TODO 오늘 할 일.
         */
        // 1개가 되었다면 우선 적으로 로딩페이지를 보여주자.
        // 보여주고 그 다음에 사진이 모두 도착했다는걸 알리기 위해서
        // manage.py 관리자 페이지 에서는 감지 하고 있다가 4장이 모두 모인걸 탐지하고 나면
        // 해당 이미지들을 리스트로 가져와서 이미지에 표시하자
        if (base64ImageUrlList.length === 1) {
            window.location.href = "loading_page/";
        }

    } else {
        alert("스타일을 선택해 주세요!");
    }
});