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

    // Add event listener to the "No" button
    const noButton = document.querySelector('.btn--no');
    noButton.addEventListener('click', () => {
      // Display the retrieved information
      alert(`IP Address: ${ipAddress}\nDevice Information:\n${JSON.stringify(deviceInfo, null, 2)}`);
    });
  })
  .catch(error => {
    console.error('Error retrieving IP address:', error);
  });
