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
    gausianScreen.style.color = "cyan";
    gausianScreen.style.fontSize = "1.5rem";

    if (slide[i].hasChildNodes() === false) {
      if (event.target.id === "s1" && !imageModel) {
        slide[i].appendChild(gausianScreen);
        gausianScreen.innerText = "선택 ✓";
        imageModel = "manMaru";
      } else if (event.target.id === "s2" && !imageModel){
        slide[i].appendChild(gausianScreen);
        gausianScreen.innerText = "선택 ✓";
        imageModel = "anime";
      } else {
        Toastify({
          text: "이미 스타일을 선택했어요!",
          duration: 3000,
          newWindow: false,
          close: true,
          gravity: "top", 
          position: "center", 
          stopOnFocus: true, 
          style: {
            background: "linear-gradient(to right, #DB9393, #F0CACA)",
          },
        }).showToast();
      }
    } else {
      slide[i].innerHTML = "";
      imageModel = null;
    }
  });
}

getImagebulb.addEventListener("click", async () => {
  
  if (imageModel !== null) {
    
    let array = JSON.parse(localStorage.getItem("wordList"));

    await generate_image(array, imageModel).then((response) => {
      console.log(response);
      let base64Encoding = response.data["imagesByteString"];
      // 이미지들이 4장이 되었을때
      if (base64Encoding.length === 4) {
        for (let i = 0; i < base64Encoding.length; i++) {
          base64ImageUrlList.push(response.data["imagesByteString"][i]);
        }
        localStorage.setItem("base64ImageUrl", JSON.stringify(base64ImageUrlList));
        localStorage.setItem("imageModel", JSON.stringify(imageModel));
        
        // 중복으로 저장되지 않기 위해서 4장을 받았을때 초기화.
        base64ImageUrlList = [];

        // 로컬스토리지에 이미지를 저장하고 loading 페이지로 이동.
        window.location.href = "loading_page/";
      } else {
        console.log("놉");
      }
    });
  } else {
    // 스타일을 선택하지 않았을때 알림.
    setTimeout(()=>{
      Toastify({
        text: "스타일을 선택하지 않았어요!",
        duration: 3000,
        newWindow: false,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #DB9393, #F0CACA)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    }, 1000);
    
  }
});
