// 여기서 교사가 check를 했는지 안했는지를 지속적으로 관찰 하는것
// 관찰후 history 하자
function confirmed() {
    let confirmed = localStorage.getItem("confirm");
    console.log(`로컬 스토리지 값을 확인하고 있습니다. 현재 값은 : ${confirmed}`);


    console.log(confirmed);
    if (confirmed === "true") {
        console.log("true 입니다.");
        localStorage.setItem("confirm", "false");
        history.go(-3);
    } else {
        console.log("false 입니다.");
    }
}


setInterval(confirmed, 2000);