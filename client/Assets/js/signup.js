document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signupForm');
  const signupBtn = document.getElementById('signupBtn');
  const fullName = document.getElementById('fullname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const reEnterPassword = document.getElementById('re-enterpassword');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  signupBtn.addEventListener('click', function (event) {
    event.preventDefault();
    errorMessage.innerText = '';
    successMessage.innerText = '';

    // Helper function to display error messages
    function showError(input, message) {
      const errorElement = input.parentElement.querySelector('.error-message');
      errorElement.innerText = message;
      input.classList.add('error');
    }

    // Helper function to remove error messages
    function removeError(input) {
      const errorElement = input.parentElement.querySelector('.error-message');
      errorElement.innerText = '';
      input.classList.remove('error');
    }

    let isValid = true;

    // Validation checks for full name
    if (fullName.value.trim().split(' ').length < 2) {
      showError(fullName, 'Full name must contain at least two names');
      isValid = false;
    } else {
      removeError(fullName);
    }

    // Validation checks for email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.value)) {
      showError(email, 'Invalid email format');
      isValid = false;
    } else {
      removeError(email);
    }

    // Validation checks for password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password.value)) {
      showError(password, 'Password must contain at least 8 characters with a combination of uppercase, lowercase, numbers, and special characters');
      isValid = false;
    } else {
      removeError(password);
    }

    // Validation checks for re-entered password
    if (password.value !== reEnterPassword.value) {
      showError(reEnterPassword, 'Passwords do not match');
      isValid = false;
    } else {
      removeError(reEnterPassword);
    }

    // If all inputs are valid, store the user data in the local storage
    if (isValid) {
      const userData = {
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        password: password.value
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // Handle successful signup
      successMessage.innerText = 'Account created successfully!';

      // Reset the form fields after successful signup
      form.reset();
    }
  });
});
