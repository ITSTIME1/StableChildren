
import { generateImageURL, regenerateURL } from "../constants/constant.js";

// 이미지 생성 api
export async function generate_image(prompts, model) {
  console.log(`${prompts} + ${model}`);

  console.log(typeof prompts);
  try {
    let response = await axios.post(generateImageURL, {
      method: "post",
      params: {
        image_model: model,
        prompt: prompts,
      },
      timeout: 1000,
      responseType: "json",
      responseEncoding: "utf8",
    });

    if (response.status === 200) {
      return response;
    }
    

  } catch {
    return "error";
  }
}

// 재생성을 위한 api (managePage 용)
export async function regenerate_image(prompts, model, count) {
  try {
    let response = await axios.post(regenerateURL, {
      method: "post",
      params: {
        image_model: model,
        prompt: prompts,
        batch_size: count,
      },
      timeout: 1000,
      responseType: "json",
      responseEncoding: "utf8",
    });
    
    if (response.status === 200) {
      return response;
    }
  } catch {
    return "error";
  }
}