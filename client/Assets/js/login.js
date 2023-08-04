document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email');
  const password = document.getElementById('password');

  const userData = JSON.parse(localStorage.getItem('user'));

  //display error message
  function showError(message) {
    const errorElement = document.getElementById('loginErrorMessage');
    errorElement.innerText = message;
  }

  //check if error message is displayed and remove it
  function removeError() {
    const errorElement = document.getElementById('loginErrorMessage');
    errorElement.innerText = '';
  }

//check if email and password are empty
  if (email.value.trim() === '' || password.value.trim() === '') {
    showError('Please fill in all fields');
    return;
  }

  if (!userData || email.value.trim() !== userData.email || password.value !== userData.password) {
    showError('Invalid email or password');
  } else {
    removeError();
    const successElement = document.getElementById('loginSuccessMessage');
    successElement.innerText = 'Logged in successfully!';
    window.location.href = './htmlParts/dashboard.html';
  }
});
