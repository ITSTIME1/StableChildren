
import { endPoint } from "../constants/constant.js";

export async function get_generated_image(prompts, model) {
  console.log(`${prompts} + ${model}`);

  console.log(typeof prompts);
  try {
    let response = await axios.post(endPoint, {
      method: "post",
      params: {
        image_model: model,
        prompt: prompts,
      },
      timeout: 1000,
      responseType: "json",
      responseEncoding: "utf8",
    });

    return response;

  } catch {
    return "error";
  }
}


