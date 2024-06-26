document.addEventListener('DOMContentLoaded', async () => {
  const usersTableBody = document.querySelector('#usersTable tbody');

  // Fetch user data
  try {
    const response = await fetch('../users');
    const users = await response.json();

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.stage}</td>
        <td>${user.messages.join(', ')}</td>
        <td>
          <button class="send-message" data-name="${user.name}">Send Message</button>
          <button class="kick-user" data-name="${user.name}">Kick User</button>
        </td>
      `;
      usersTableBody.appendChild(row);
    });

    // Add event listeners for buttons
    document.querySelectorAll('.send-message').forEach(button => {
      button.addEventListener('click', async () => {
        const name = button.getAttribute('data-name');
        const message = prompt('Enter your message:');
        if (message) {
          await fetch('../send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message })
          });
          alert('Message sent');
        }
      });
    });

    document.querySelectorAll('.kick-user').forEach(button => {
      button.addEventListener('click', async () => {
        const name = button.getAttribute('data-name');
        await fetch('../kick', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        alert('User kicked');
        location.reload();
      });
    });

  } catch (error) {
    console.error('Error fetching users:', error);
  }
});
