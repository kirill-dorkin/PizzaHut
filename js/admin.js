const correctPassword = '121212';

function fetchUserData() {
  fetch(`${process.env.API_URL}/admin-data`)
    .then(res => res.text())
    .then(data => {
      document.getElementById('user-data').value = data || 'No data yet.';
    })
    .catch(err => {
      console.error(err);
      document.getElementById('user-data').value = 'Error loading data.';
    });
}

function showAdminPanel() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('admin-content').style.display = 'block';

  fetchUserData();
  setInterval(fetchUserData, 5000);
}

document.getElementById('login-btn').addEventListener('click', () => {
  const entered = document.getElementById('admin-password').value;

  if (entered === correctPassword) {
    sessionStorage.setItem('adminAuthorized', 'true');
    showAdminPanel();
  } else {
    document.getElementById('auth-message').textContent = 'Incorrect password!';
  }
});

document.getElementById('download-btn').addEventListener('click', () => {
  window.open(`${process.env.API_URL}/download-users`, '_blank');
});

document.getElementById('copy-btn').addEventListener('click', () => {
  const text = document.getElementById('user-data').value;
  navigator.clipboard.writeText(text)
    .then(() => alert('Copied to clipboard!'))
    .catch(err => alert('Failed to copy.'));
});

document.getElementById('save-btn').addEventListener('click', () => {
  const updatedText = document.getElementById('user-data').value;
  fetch(`${process.env.API_URL}/admin-edit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updatedData: updatedText })
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      fetchUserData();
    })
    .catch(err => {
      console.error(err);
      alert('Failed to update.');
    });
});

if (sessionStorage.getItem('adminAuthorized') === 'true') {
  showAdminPanel();
}
