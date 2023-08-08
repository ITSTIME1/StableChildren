// web content constants
export const wordArea = document.getElementById("word-area");
export const toggleBtn = document.getElementById("logo-image");
export const gausianScreen = document.querySelectorAll(".gausian");
export const completeBtn = document.getElementById("complete-btn");
export const title = document.querySelector(".book-title");
export const hoverSound = document.getElementById('hover-sound');

// server request endpoint
export const generateImageURL = "http://127.0.0.1:8000/getImage/generateImage/";
export const handDetectionURL = "http://127.0.0.1:8000/child/hand_detection/";
export const regenerateURL = "http://127.0.0.1:8000/regenerate/regenerateImage/";