import { generate_image_path } from "./index.js";

export function adjust_image() {

  // storage 이벤트 리스너 등록

  
  /**
   * @todo 관리자 페이지를 어떻게 만들지 다시 고민해보자.
   */


  const buttonClicked = localStorage.getItem('buttonClicked');
  if (buttonClicked === 'true') {
    console.log('로컬 스토리지의 buttonClicked 값이 true로 변경되었습니다!');
    // 원하는 동작 수행
    // 이후 처리를 위해 다시 'buttonClicked' 값을 초기화하는 것도 고려할 수 있습니다.
    localStorage.setItem('buttonClicked', 'false');
    return true;
  } 
}
