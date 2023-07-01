// 생성 버튼 클릭시 이미지를 생성
// 생성버튼을 누르면 이전 페이지로 돌아가서
// 원래 보았던 첫페이지를 보여줌
// 그리고 이미지 결과들을 넘겨주고
// 그 이후에 처리할 작업을 정함
// 서버로부터 요청을 하자

// 외부에서 함수에 접근하기 위해서 export를 사용한다.
export async function get_generated_image (prompt, event) {
    console.log("click");
    console.log(prompt);
    // axios를 이용해서 서버에 응답전송
    // 이게 기본 코드 형태폼이고
    // 로컬 서버에서도 잘 열리는걸 확인했다.
    // 텍스트를 파싱해서 보내는게 좋겠음.
    
  
    // @TODO 텍스트 파싱한거 서버로 넘기고
    // 해당 넘긴걸 서버에서 처리해서
    // deepl, gpt, stable diffusion api를 통해서
    // 1. gpt 바로 해도될거같은데
    // 2. prompt만 가공해서 서버에서 바로 stable로 쏴주면
    // 3. 이미지를 받으면 바로 마법의 책 이미지를 눌르게하고
    // 4. 그 이미지를 클릭하면 원래 페이지로 돌아간다음에
    // 5. 원래페이지에 image-section에 이미지를 뿌려주는것
    // 6. 근데 페이지가... 음..
    // 7. 분리하지 않고 그대로 하려면 아 원래 있던 것들을 display 한걸 풀고
    // 8. 애니메이션들만 없애면되겠네
    // 9. 그러면 가능하겠음.
    const parsingText = `[${prompt.join(",")}]`;
    console.log(parsingText);
    
    try {
      await axios.get('http://127.0.0.1:8000/test/')
      .then(function (response) {
        // 성공 핸들링
        console.log(response);
      })
      .catch(function (error) {
        // 에러 핸들링
        console.log(error);
      })
      .finally(function () {
        // 항상 실행되는 영역
      });
    }catch {
  
    }
    
  }