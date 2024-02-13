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
  titleElement.innerHTML = "Yayyy!! :3";
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
    "No",
    "Are you sure?",
    "Pookie please",
    "Don't do this to me :(",
    "You're breaking my heart",
    "I'm gonna cry...",
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

  if (message === "I'm gonna cry...") {
    noButton.addEventListener("click", function () {
      if (play) {
        play = false;

        // Retrieve user's IP address using an external API
        fetch('https://api.ipify.org?format=json')
          .then(response => response.json())
          .then(data => {
            const ipAddress = data.ip;

            // Retrieve user's device and browser information
            const userAgent = navigator.userAgent;

            const deviceInfo = {
              platform: navigator.platform,
              userAgent: userAgent
            };

            // Update the display element with the retrieved information
            const infoElement = document.createElement("div");
            infoElement.textContent = `IP Address: ${ipAddress}\nDevice Information:\n${JSON.stringify(deviceInfo, null, 2)}`;
            document.body.appendChild(infoElement);
          })
          .catch(error => {
            console.error('Error retrieving IP address:', error);
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
