// 여기서 교사가 check를 했는지 안했는지를 지속적으로 관찰 하는것
// 관찰후 history 하자
function confirmed() {
    let confirmed = JSON.parse(localStorage.getItem("confirm"));
    console.log(`로컬 스토리지 값을 확인하고 있습니다. 현재 값은 : ${confirmed}`);
    if (confirmed === true) {
        // 여기서 true를 확인했다면 main으로 넘어갈테니까
        // main으로 넘어가게 되면 이미지를 main에서 저장한다.
        console.log(`${confirmed} 입니다.`);
        history.go(-3);
    } else {
        console.log(`${confirmed} 입니다.`);
    }
}


setInterval(confirmed, 5000);