document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signupForm');
  const signupBtn = document.getElementById('signupBtn');
  const fullName = document.getElementById('fullname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const reEnterPassword = document.getElementById('re-enterpassword');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  document.querySelector('#signupForm').addEventListener('submit', function (event) {
    event.preventDefault();
    errorMessage.innerText = '';
    successMessage.innerText = '';

    // checking error messages
    function showError(input, message) {
      // const errorElement = input.parentElement.querySelector('.error-message');
      // errorElement.innerText = message;
      errorMessage.innerHTML = message
      input.classList.add('error');
    }

    // removing error messages
    function removeError(input) {
      // const errorElement = input.parentElement.querySelector('.error-message');
      // errorElement.innerText = '';
      errorMessage.innerHTML = ''
      input.classList.remove('error');
    }

    let isValid = true;
    
    const emailReg = /^\S+@\S+\.\S+$/;
    const passwordReg= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    // checking if fullname validates
    if (fullName.value.trim().split(' ').length < 2) {
      console.log("reached here");
      showError(fullName, 'Full name must contain at least two names');
      isValid = false;
    } else if(!emailReg.test(email.value)){
      showError(email, 'Invalid email format');
      isValid = false;
    }else if(!passwordReg.test(password.value)){
      showError(password, 'Password must contain at least 8 characters with a combination of uppercase, lowercase, numbers, and special characters');
      isValid = false;
    }else if (password.value !== reEnterPassword.value) {
      showError(reEnterPassword, 'Passwords do not match');
      isValid = false;
    } 
    // checking if email is in the right format
   

    // Checking if password passes the required validation
    

    // Checking if re-entered password matches the password
  
    //checking if all fields are filled 
    if (isValid) {
      const names = fullName.value.split(' ')
      // const userData = {
      //   fullName: fullName.value.trim(),
      //   email: email.value.trim(),
      //   password: password.value
      // };
      // localStorage.setItem('user', JSON.stringify(userData));

      // successMessage.innerText = 'Account created successfully!';
      axios.post('http://127.0.0.1:3000/api/v1/employee/register', 
      {
        firstName: names[0],
        lastName: names[1],
        email: email.value,
        password: password.value
      }, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response)=>{
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        window.location.href='../Auth/login.html'
      })
      .catch((e)=>{
        if(e?.message){
            showError(e.message)
        }else if(e?.response.data.error){
            showError(e.response.data.error)
        }
      })
      form.reset();
    }
  });
});
