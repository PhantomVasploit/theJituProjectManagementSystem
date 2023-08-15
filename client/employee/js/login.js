const email = document.querySelector('#email')
const password = document.querySelector('#password')

function handleSubmissionError(message){
    Toastify({
            text: message,
            duration: 5000, // Display duration in milliseconds
            backgroundColor: "#f44336",
            close: true,
            stopOnFocus: true,
            gravity: "top", // Position of the notification
            position: "center", // Alignment of the notification
        }).showToast();
}


document.querySelector('#jitu-login').addEventListener('submit', (e)=>{
    e.preventDefault()

    const emailErorMessage = document.querySelector('.email-error')
    if(email.value == ''){
        email.style.border = "1px solid red"
        emailErorMessage.innerHTML = "Please enter your email address"
        emailErorMessage.style.color = "red"
        emailErorMessage.style.display = "block"
        emailErorMessage.style.padding = "5px"

        email.addEventListener('input', ()=>{
            email.style.border = ".5px solid black"
            emailErorMessage.innerHTML = ""
            emailErorMessage.style.color = "black"
            emailErorMessage.style.display = "none"                    
        })
    }

    const passwordErrorMessage = document.querySelector('.password-error')
    if(password.value == ''){
        password.style.border = "1px solid red"
        passwordErrorMessage.innerHTML = "Please enter your email address"
        passwordErrorMessage.style.color = "red"
        passwordErrorMessage.style.display = "block"
        passwordErrorMessage.style.padding = "5px"

        password.addEventListener('input', ()=>{
            password.style.border = ".5px solid black"
            passwordErrorMessage.innerHTML = ""
            passwordErrorMessage.style.color = "black"
            passwordErrorMessage.style.display = "none"                    
        })
    }

    if(email.value && password.value){

        axios.post('http://127.0.0.1:3000/api/v1/login', 
        {
            email: email.value,
            password: password.value
        })
        .then((response)=>{
            Toastify({
                text: response.data.message,
                backgroundColor: "#4caf50", // Custom success color
                duration: 3000, // Time in milliseconds before the toast auto-closes
                close: true,
                gravity: "top",
                position: "success",
              }).showToast();
              console.log(response);
              localStorage.setItem('user', JSON.stringify(response.data.user))
              localStorage.setItem('token', response.data.token)
              window.location.href = './dashboard.html'
        })
        .catch((e)=>{
            
            if(!e.response){
                handleSubmissionError(e.message)
            }else if(e.response.status == 403){
                window.location.href = `./reactivateAccount.html?email=${email.value}`
            }else{
                handleSubmissionError(e.response.data.error)
            }
        })
    }


})


