document.addEventListener('DOMContentLoaded', () => {
  const startForm = document.getElementById('startForm');
  const storyContainer = document.getElementById('storyContainer');
  const storyText = document.getElementById('storyText');
  const nextStageForm = document.getElementById('nextStageForm');
  const passcodeInput = document.getElementById('passcode');
  let lastMessages = [];

  startForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;

    //Anywhere that there is a link that says something, replace something with your actual link to the website. Make sure that if there is an ending (an endpoint) like /start or /next in the URL, that you don't remove it.
    
    try {
      const response = await fetch('https://something/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
  
      const data = await response.json();
      alert(data.story);
      storyContainer.style.display = 'block';
      storyText.textContent = data.story;
      nextStageForm.style.display = 'block';
      startPollingForMessages(name);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Error starting game: ' + error.message);
    }
  });

  nextStageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const passcode = passcodeInput.value;
  //Wherever it says a link, if it says "something", then replace that something with the real url to your website. If it says something at the end (an endpoint) like /next or /start, don't remove it.
    try {
      const response = await fetch('https://something/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, passcode })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.success) {
        storyText.textContent = data.story;
        passcodeInput.value = '';
        // Hide the form if the final stage is reached
        if (data.story.includes('YAY')) {
          nextStageForm.style.display = 'none';
        }
      } else {
        alert('Incorrect passcode');
      }
    } catch (error) {
      console.error('Error progressing to next stage:', error);
      alert('Error progressing to next stage: ' + error.message);
    }
  });
  

  const apiUrl = 'https://something'; // Update with your server URL
  const updateInterval = 5000; // Check for new messages every 5 seconds

  function startPollingForMessages(name) {
    setInterval(async () => {
      try {
        const response = await fetch(`${apiUrl}/get-messages?name=${name}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const messages = await response.json();
        if (JSON.stringify(messages) !== JSON.stringify(lastMessages)) {
          lastMessages = messages;
          if (messages.length > 0) {
            const newMessage = messages[messages.length - 1];
            showAlert(newMessage);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, updateInterval);
  }

  function showAlert(message) {
    const alertContainer = document.createElement('div');
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '0';
    alertContainer.style.width = '100%';
    alertContainer.style.backgroundColor = 'red';
    alertContainer.style.color = 'white';
    alertContainer.style.textAlign = 'center';
    alertContainer.style.padding = '1em';
    alertContainer.textContent = `New message: ${message}`;
    
    document.body.appendChild(alertContainer);
    
    setTimeout(() => {
      alertContainer.remove();
    }, 5000);
  }
});
