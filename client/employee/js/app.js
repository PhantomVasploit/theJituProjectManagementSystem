const token = localStorage.token 
let user = localStorage.user
let inProgress = []
let completed = []

function checkData(){
    if(!user || !token){
        window.location.href = '../../index.html'
    }
}

window.onload = checkData

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

user = JSON.parse(localStorage.user)
const profileInfo = document.querySelector('#profile-info')
profileInfo.innerHTML = `
    <p class="name">${user.first_name ?? user.firstName} ${user.lastName ?? user.last_name}</p>
    <small class="location">Nyeri Kenya</small>
`



// fetch data
axios.get(`http://127.0.0.1:3000/api/v1/employee/projects/${user.id}`, 
{
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})
.then((response)=>{
    
    let inProgressHtml = document.querySelector('#in-progress-projects')
    let completedHtml = document.querySelector('#completed-projects')
    let completedContent = ''
    let completedNoData = `
        <div class="completed-no-data">
            <div class="no-data-left"></div>
            <div class="content">
                <div class="image">
                    <img width="30px" height="30px" src="../assests/work-in-progress.png" alt="">
                </div>
                <div class="text">
                    <p>No completed tasks yet<p>
                </div>
            </div>
        </div>
    `
    let inProgressNoData = document.querySelector('.progress-no-data')
    let inProgressContent = ''
  response.data.projects.forEach((project)=>{
    project.is_complete == true ? completed.push(project) : inProgress.push(project)
  })
  
  if(inProgress.length <=0){
    inProgressHtml.innerHTML = ''
  }else{
    inProgressNoData.style.display='none'
      inProgress.forEach((project)=>{

        inProgressContent += `
        <div class="project-item">
                                    
            <div class="project-top">
                <p><strong>${project.project_name}</strong></p>
                <div class="btn">
                    <button id=${project.id} >Done</button>
                </div>
            </div>
    
            <div class="project-middle">
                <p>
                    ${project.project_description}
                </p>
            </div>
    
            <div class="project-bottom">
                <div class="right">
                    <small>${new Date(project.start_date).toLocaleDateString()}</small>
                </div>
                <div class="left">
                        <div class="icon">
                            <iconify-icon icon="eos-icons:hourglass"></iconify-icon>
                        </div>
                        <small class="icon-text">${new Date(project.end_date).toLocaleDateString()}</small>
                </div>
            </div>
    
        </div>
        `
      })

      inProgressHtml.innerHTML = inProgressContent
      
  }


  if(completed.length <= 0){
    completedHtml.innerHTML = completedNoData
  }else{
    completed.forEach((project)=>{
        completedContent += `
        <div class="project-item">
                                
            <div class="project-top">
                <p><strong>${project.project_name}</strong></p>
                
            </div>

            <div class="project-middle">
                <p>
                    ${project.project_description}
                </p>
            </div>

            <div class="project-bottom">
                <div class="right">
                    <small>${new Date(project.start_date).toLocaleDateString()}</small>
                </div>
            </div>

        </div>  
        `
    })
    completedHtml.innerHTML = completedContent
  }

})
.catch((e)=>{
    if(!e.response){
        handleSubmissionError(e.message)
    }else{
        handleSubmissionError(e.response.data.message)
    }
})


function logOut(){
    localStorage.setItem('user', '')
    localStorage.setItem('token', '')
    window.location.href='../../index.html'
}

document.querySelector('#logout').addEventListener('click', ()=>{
    logOut()
})