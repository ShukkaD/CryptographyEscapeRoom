async function fetchUsers() {
  const response = await fetch('../dashboard');
  const users = await response.json();
  const tbody = document.getElementById('users-table').querySelector('tbody');
  tbody.innerHTML = '';
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.stage}</td>
      <td>
        <button onclick="sendMessage('${user.name}')">Send Message</button>
        <button onclick="kickUser('${user.name}')">Kick</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function sendMessage(name) {
  const message = prompt('Enter your message:');
  if (message) {
    await fetch('../send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, message })
    });
    await fetchUsers(); // wait for fetchUsers to complete before continuing
  }
}

async function kickUser(name) {
  await fetch('../kick', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });
  await fetchUsers(); // wait for fetchUsers to complete before continuing
}

fetchUsers();