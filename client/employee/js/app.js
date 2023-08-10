const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../index.html'
    }
}

window.onload = checkData

user = JSON.parse(localStorage.user)
const profileInfo = document.querySelector('.profile-info')
profileInfo.innerHTML = `
    <p>${user.email}</p>
    <p>${user.first_name ?? user.firstName} ${user.lastName ?? user.last_name}</p>
    <p>Kenya</p>
`


// form logic
const firstName = document.querySelector('#firstName')
const lastName = document.querySelector('#lastName')
const email = document.querySelector('#email')

firstName.value = user.firstName ?? user.first_name
lastName.value = user.lastName ?? user.last_name
email.value = user.email

document.querySelector('.edit-profile-form').addEventListener('submit', (e)=>{
    e.preventDefault()
    axios.put(`http://127.0.0.1:3000/api/v1/employee/${user.id}`, 
    {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value
    }, 
    {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        }
    })
    .then((response)=>{
        localStorage.setItem('user', JSON.stringify(response.data.user))
        window.location.reload()
    })
    .catch((e)=>{
        console.log(e);
    })
})


// fetching projects

const recordHolder = document.querySelector('.record')
const projects = document.querySelector('.projects')
const noProject = document.querySelector('.no-project')
    function loadData(){
        axios.get(`http://127.0.0.1:3000/api/v1/projects/user/${user.id}`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token}`
        }
    })
    .then((response)=>{
        
        if(response.data.user_projects.length <= 0){
            noProject.innerHTML = 'You are yet to be assigned a project'
            projects.style.display = "none"
        }else{
            
            

            let records = ``
            response.data.user_projects.forEach((project)=>{
                console.log(project);
                records += `
                    <div class="records">
                        <p>${project.project_name}</p>
                        <p>${project.project_description}</p>
                        <p>${project.project_status}</p>
                        <p>${project.start_date}</p>
                        <p>${project.end_date}</p>
                    </div>
                `
                recordHolder.innerHTML = records
            })
        }
    })
    .catch((e)=>{
        console.log(e);
    })
}

loadData()

function logOut(){
    localStorage.setItem('user', '')
    localStorage.setItem('token', '')
    window.location.href='../../index.html'
}

document.querySelector('.logout').addEventListener('click', ()=>{
    logOut()
})