const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../index.html'
    }
}

window.onload = checkData
user = JSON.parse(localStorage.user)

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

let btn = document.querySelector('#deact-btn')
let passwordEl = document.querySelector('#password')
btn.addEventListener('click', ()=>{
    axios.post('http://127.0.0.1:3000/api/v1/employee/deactivate-account', 
    {
        email: user.email,
        password: passwordEl.value
    },
    {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then((response)=>{
        localStorage.token = ''
        localStorage.user = ''
        window.location.href = './login.html'
    })  
    .catch((e)=>{
        if(!e.response){
            handleSubmissionError(e.message)
        }else{
            handleSubmissionError(e.response.data.error)
        }
    })      
})