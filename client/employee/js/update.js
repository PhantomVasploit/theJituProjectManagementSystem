const firstName = document.querySelector('#first-name')
const lastName = document.querySelector('#last-name')
const email = document.querySelector('#email')
const password = document.querySelector('#password')

const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../index.html'
    }
}

window.onload = checkData
user = JSON.parse(localStorage.user)

firstName.value = user.first_name
lastName.value = user.last_name
email.value = user.email

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
    
    const firstNameErorMessage = document.querySelector('.first-name-error')
    if(firstName.value == ''){
        firstName.style.border = "1px solid red"
        firstNameErorMessage.innerHTML = "Please enter your first name"
        firstNameErorMessage.style.color = "red"
        firstNameErorMessage.style.display = "block"
        firstNameErorMessage.style.padding = "5px"

        firstName.addEventListener('input', ()=>{
            firstName.style.border = ".5px solid black"
            firstNameErorMessage.innerHTML = ""
            firstNameErorMessage.style.color = "black"
            firstNameErorMessage.style.display = "none"                    
        })
    }

    const lasttNameErorMessage = document.querySelector('.last-name-error')
    if(lastName.value == ''){
        lastName.style.border = "1px solid red"
        lasttNameErorMessage.innerHTML = "Please enter your last name"
        lasttNameErorMessage.style.color = "red"
        lasttNameErorMessage.style.display = "block"
        lasttNameErorMessage.style.padding = "5px"

        lastName.addEventListener('input', ()=>{
            lastName.style.border = ".5px solid black"
            lasttNameErorMessage.innerHTML = ""
            lasttNameErorMessage.style.color = "black"
            lasttNameErorMessage.style.display = "none"                    
        })
    }


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


    if(firstName.value && lastName.value && email.value){

        axios.put(`http://127.0.0.1:3000/api/v1/employee/${user.id}`, 
        {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value
        }, 
        {
            headers: {
                "Content-Type": 'application/json',
                'Authorization': `Bearer: ${token}  `
            }
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
              window.location.href = './profile.html'
        })
        .catch((e)=>{
            if(!e.response){
                handleSubmissionError(e.message)
            }else{
                handleSubmissionError(e.response.data.error)
            }
        })
    }


})


