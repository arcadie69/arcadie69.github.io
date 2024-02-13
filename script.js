function isIOSDevice() {
  const userAgent = navigator.userAgent.toLowerCase();

  return /iphone|ipod|ipad/.test(userAgent);
}

// Add iOS-specific camera permission requests
function requestCameraPermission() {
  return new Promise((resolve, reject) => {
    if (!isIOSDevice()) {
      resolve();
      return;
    }

    const constraints = {
      audio: false,
      video: { facingMode: "user" }
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Modify the provided code to automatically take a front photo
async function takeFrontPhoto() {
  if (!isIOSDevice()) {
    return;
  }

  try {
    await requestCameraPermission();

    // Trigger the photo capture functionality
    const videoElement = document.querySelector('video');
    const canvasElement = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Draw the current frame from the video element to the canvas element
    canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Convert the canvas element to a data URL
    const dataUrl = canvasElement.toDataURL('image/jpeg');

    // Create a new image element and set its source to the data URL
    const imageElement = new Image();
    imageElement.src = dataUrl;

    // Add the image element to the DOM
    document.body.appendChild(imageElement);

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
