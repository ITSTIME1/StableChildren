// 여기에서 값을 클릭했을때

const agreeBtn = document.getElementById("agree");
agreeBtn.addEventListener("click", ()=>{
  localStorage.setItem("confirm", "true");
});