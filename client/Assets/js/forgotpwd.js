document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('PwdEmail');
  
  // Helper function to display error messages
  function showError(message) {
    const errorElement = document.getElementById('forgotPwdErrorMessage');
    errorElement.innerText = message;
  }

  // Helper function to remove error messages
  function removeError() {
    const errorElement = document.getElementById('forgotPwdErrorMessage');
    errorElement.innerText = '';
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email.value)) {
    showError('Invalid email format');
  } else {
    removeError();
    // Check if the email exists in the local storage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.email === email.value.trim()) {
      // Simulate sending reset password email
      // You can implement your email sending logic here
      // For example: sendResetPasswordEmail(userData.email);
      // Clear any existing success message
      const successElement = document.getElementById('forgotPwdSuccessMessage');
      successElement.innerText = 'An email has been sent to you with password reset instructions.';
    } else {
      showError('Invalid email address');
    }
  }
});

  