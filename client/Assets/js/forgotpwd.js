document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('PwdEmail');
  
  // SHOWING ERROR MESSAGE
  function showError(message) {
    const errorElement = document.getElementById('forgotPwdErrorMessage');
    errorElement.innerText = message;
  }

  // removi
  function removeError() {
    const errorElement = document.getElementById('forgotPwdErrorMessage');
    errorElement.innerText = '';
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email.value)) {
    showError('Invalid email');
  } else {
    removeError();
    // checking
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.email === email.value.trim()) {
      const successElement = document.getElementById('forgotPwdSuccessMessage');
      successElement.innerText = 'An email has been sent to you with password reset instructions.';
    } else {
      showError('Invalid email address');
    }
  }
});

  