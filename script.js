function updateNoButtonText() {
  const message = generateMessage(noCount);
  if (message === "I'm gonna cry...") {
    // Display visitor information
    const ip = "123.456.789.012"; // Replace with actual IP address
    const userAgent = navigator.userAgent;
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `Your IP address is ${ip} and your user agent is ${userAgent}`;
    document.body.appendChild(messageElement);
    showVisitorInfo();
  }
  noButton.innerHTML = message;
}

function showVisitorInfo() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.ipify.org?format=json', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const ip = JSON.parse(xhr.responseText).ip;
      document.getElementById('ip').textContent = ip;
      document.getElementById('device').textContent = navigator.userAgent;
      document.getElementById('browser').textContent = navigator.appName;
      document.getElementById('visitor-info').style.display = 'block';
    }
  };
  xhr.send();
}
