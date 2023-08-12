

// 관리자로부터 확인을 받기전까지의 값들을 체크.
function check_confirmed() {
    let confirmed = JSON.parse(localStorage.getItem("confirm"));
    console.log(`로컬 스토리지 값을 확인하고 있습니다. 현재 값은 : ${confirmed}`);
    if (confirmed === true) {
        Toastify({
            text: "그림 도착! 슝~",
            duration: 3500,
            newWindow: false,
            close: true,
            gravity: "top", 
            position: "center", 
            stopOnFocus: true, 
            style: {
              background: "linear-gradient(to right, #DB9393, #F0CACA)",
            },
        }).showToast();
        console.log(`${confirmed} 입니다.`);
        history.go(-3);
    } else {
        Toastify({
            text: "열심히 그리고 있어요!",
            duration: 5000,
            newWindow: false,
            close: true,
            gravity: "top", 
            position: "center", 
            stopOnFocus: true, 
            style: {
              background: "linear-gradient(to right, #DB9393, #F0CACA)",
            },
        }).showToast();
        console.log(`${confirmed} 입니다.`);
    }
}


setInterval(check_confirmed, 5000);