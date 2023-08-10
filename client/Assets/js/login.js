
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email');
  const password = document.getElementById('password');


  //Checking the error message
  function showError(message) {
    const errorElement = document.getElementById('loginErrorMessage');
    errorElement.innerText = message;
  }

  //Removing the error message
  function removeError() {
    const errorElement = document.getElementById('loginErrorMessage');
    errorElement.innerText = '';
  }

//checking if all fields are filled
  if (email.value.trim() === '' || password.value.trim() === '') {
    showError('Please fill in all fields');
    return;
  }else{
    axios.post(
      'http://127.0.0.1:3000/api/v1/login', 
      {
        email: email.value.trim(),
        password: password.value.trim()
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((result)=>{
        removeError()
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.user))
        const successElement = document.getElementById('loginSuccessMessage');
        successElement.innerText = result.data.message;
        window.location.href = result.data.user.is_admin == 0 ? '../employee/html/dashboard.html' : '../dashboard/dashboard.html';
      })
      .catch((e)=>{
        if(e?.message){
            showError(e.message)
        }else if(e?.response.data.error){
            showError(e.response.data.error)
        }
      }) 
  }
});

