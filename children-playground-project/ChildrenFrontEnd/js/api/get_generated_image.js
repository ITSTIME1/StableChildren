// @TODO 할 내용
// 우선 스타일을좀 골라야겠다
// 스타일은 = 모델
// 아이들이 만들어 보고 싶은 그림 스타일의 모델을 슬라이드로 선택하게 한다음 ( 이 과정은 아이들이 생성을 누르고 나면 선택하게 한다.)
// 스타일을 골랐다면 해당 모델의 model_id와 함께 서버측으로 보내서
// 서버측에서 prompt 내용과 모델id내용을 합쳐서 stable diffusion모델을 활용해 이미지를 생성
// 이미지를 비동기적으로 받고 한번에 뽑을 이미지는 4장을 뽑은다음에 같은 스타일로 다른 이미지를 뽑기 위해서
// 생성할때 prompt 리스트에다가 이전 프롬포트를 미리 저장한다.
// 그리고 다시 그려줘! 라고 하면 다시 이전 내용을 넘겨주면서 api호출을 통해서 이미지를 불러온다.
// 한번에 4장씩이니까 999장 뽑는다면 약 249번 정도 사용할 수 있는 횟수다.
// 이 정도면 한번 사용하는데 굉장히 충분한 내용일것 같고
// 모델의 종류는 미리 선정해둔 모델을 가지고 프롬포트를 미리 입혀둔 다음에
// 부정 프롬포트와 긍정 프롬포트를 미리 넘겨준다.

// 해당 이미지를 받고 아이들의 수업에서 그 그림을 활용해서 이야기를 만들어 본다거나, 동화를 만들어 본다거나
// 색칠을 해본다거나 할 수 있을 것 같다.
// 여기서 추가하고 싶은 기능은 그림 to 스케치로 변경이 가능하다면 그 그림을 바로 스케치로 뽑아서 그림 그리게끔 하는것도 좋은데.
// 동화책 만드는 기능을 이후에 생각해보자.

import { endPoint } from "../constants/constant.js";
import { prompt } from "../animation/animation.js";


// endPoint쪽으로 get 요청을 날리자
// 서버에서 받을 수 있게
export async function get_generated_image (prompts) {
    try {
      // @TODO 오늘 할일
      // prompt 받은 리스트를 넘겨주면 될거 같은데 + 스타일이랑 해서
      // 그럼 스타일을 고를 화면을 만들어줘야 겠네
      // const response = await axios.get(endPoint, [
      // ]);
      const response = await axios.post(endPoint, {
        method : "post",
        params: {
          image_style : "ghibri",
          prompt : [prompts],
        },
        timeout: 1000,
        responseType: 'json',
        responseEncoding: 'utf8',
      })
      console.log(response);
    }catch(error) {
      console.log(error);
    }
}

// async function getId() {
//   const userUrl = "https://jsonplaceholder.typicode.com/users";
//   try {
//     // get요청을해서 아이디를 가지고오고
//     const userData = await axios.get(userUrl);
//     let result = [];
    
//     userData.data.forEach(element => {
//         result.push(element.id);
//     });

//     return result;
//   } catch(error) {
//     // 해당 비동기 요청에 대한 에러를 잡고
//     console.log(error);
//   }
// }

// // 음 비동기 요청은 이렇게 하면 되는구나
// async function getName() {
//   const userUrl = "https://jsonplaceholder.typicode.com/users";
//   try {
//     // get요청을해서 아이디를 가지고오고
//     const userData = await axios.get(userUrl);
//     let result = [];
//     userData.data.forEach(element => {
//       result.push(element.name);
//     });
//     return result;
//   } catch(error) {
//     // 해당 비동기 요청에 대한 에러를 잡고
//     console.log(error);
//   }
// }


// export async function total() {
//   try {
//     const idData = await getId();
//     const nameData = await getName();
//     console.log(`${idData + "\n"}, ${nameData}`);
    
//     console.log(prompt);
//   } catch(error) {
//     console.log(error);
//   }
// }
