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

    // checking error messages
    function showError(input, message) {
      const errorElement = input.parentElement.querySelector('.error-message');
      errorElement.innerText = message;
      input.classList.add('error');
    }

    // removing error messages
    function removeError(input) {
      const errorElement = input.parentElement.querySelector('.error-message');
      errorElement.innerText = '';
      input.classList.remove('error');
    }

    let isValid = true;

    // checking if fullname validates
    if (fullName.value.trim().split(' ').length < 2) {
      showError(fullName, 'Full name must contain at least two names');
      isValid = false;
    } else {
      removeError(fullName);
    }

    // checking if email is in the right format
    const emailReg = /^\S+@\S+\.\S+$/;
    if (!emailReg.test(email.value)) {
      showError(email, 'Invalid email format');
      isValid = false;
    } else {
      removeError(email);
    }

    // Checking if password passes the required validation
    const passwordReg= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordReg.test(password.value)) {
      showError(password, 'Password must contain at least 8 characters with a combination of uppercase, lowercase, numbers, and special characters');
      isValid = false;
    } else {
      removeError(password);
    }

    // Checking if re-entered password matches the password
    if (password.value !== reEnterPassword.value) {
      showError(reEnterPassword, 'Passwords do not match');
      isValid = false;
    } else {
      removeError(reEnterPassword);
    }

    //checking if all fields are filled 
    if (isValid) {
      const userData = {
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        password: password.value
      };
      localStorage.setItem('user', JSON.stringify(userData));

      successMessage.innerText = 'Account created successfully!';
      
      form.reset();
    }
  });
});
