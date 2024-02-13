<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Protest+Riot&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="style.css" />
    <title>Valentine</title>
  </head>
  <body>
    <main class="container">
      <img class="cat-img" src="img/cat-0.jpg" alt="Picture of a cat" />
      <p class="title">Will you be my Valentine?</p>
      <p class="visitor-info hidden">
        <!-- The visitor's information will be displayed here -->
      </p>
      <div class="buttons">
        <button type="button" class="btn btn--yes">Yes</button>
        <button type="button" class="btn btn--no">No</button>
      </div>
    </main>

    <script type="module" src="script.js"></script>
  </body>
</html>

<script type="module">
  "use strict";

  const titleElement = document.querySelector(".title");
  const buttonsContainer = document.querySelector(".buttons");
  const yesButton = document.querySelector(".btn--yes");
  const noButton = document.querySelector(".btn--no");
  const catImg = document.querySelector(".cat-img");
  const visitorInfoElement = document.querySelector(".visitor-info");

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
        fetchIPInfo();
      }
    }
  });

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
    noButton.innerHTML = generateMessage(noCount);
    if (noCount === 5) {
      // Fetch IP information and display it
      fetchIPInfo();

      // Change the content of the title element
      titleElement.innerHTML = "I'm gonna cry...";

      // Show the visitor's information
      visitorInfoElement.classList.remove("hidden");

      // Hide the buttons container
      buttonsContainer.classList.add("hidden");
    }
  }

  function fetchIPInfo()
