const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../index.html'
    }
}

window.onload = checkData

user = JSON.parse(localStorage.user)
const profileInfo = document.querySelector('#profile-info')
profileInfo.innerHTML = `
    <p class="name">${user.first_name ?? user.firstName} ${user.lastName ?? user.last_name}</p>
    <small class="location">Nyeri Kenya</small>
`
// fetch data

function logOut(){
    localStorage.setItem('user', '')
    localStorage.setItem('token', '')
    window.location.href='../../index.html'
}

document.querySelector('#logout').addEventListener('click', ()=>{
    logOut()
})