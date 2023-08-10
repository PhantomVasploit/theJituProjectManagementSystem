const token = localStorage.token 
let user = localStorage.user

function checkData(){
    if(!user || !token){
        window.location.href = '../../index.html'
    }
}

window.onload = checkData
user = JSON.parse(localStorage.user)

function loadData(){
    axios.get(`http://127.0.0.1:3000/api/v1/projects/user/${user.id}`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization_token': token
        }
    })
    .then((response)=>{
        const errorEl = document.querySelector('.error')
        const projectInfo = document.querySelector('.project-info')
        let projectHtml = ''
        errorEl.style.display = "none"
        let incomplete = response.data.user_projects.filter((project)=>{
            return project.is_completed == 0
        })
        
        incomplete.forEach((project)=>{
            projectHtml += `
                <div class="project-card">
                    <div class="top">
                        <h4>${project.project_name}</h4>
                        <div class="btn">
                            <button onclick="${()=>{markComplete(project.id)}}" class="${project.id}" >Done</button>
                        </div>
                    </div>
                    <div class="middle">
                        <p>
                            ${project.project_description}
                        </p>
                    </div>
                    <div class="bottom">
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
        projectInfo.innerHTML = projectHtml
    })
    .catch((e)=>{
        if(e?.message){
            const errorEl = document.querySelector('.error-message')
            const projectInfo = document.querySelector('.project-info')
            errorEl.innerHTML = e.message
            projectInfo.style.display = "none"
        }else if(e?.response.data.error){
            const errorEl = document.querySelector('.error-message')
            const projectInfo = document.querySelector('.project-info')
            errorEl.innerHTML = e.message
            projectInfo.style.display = "none"
        }
    })
}

loadData()


function logOut(){
    localStorage.setItem('user', '')
    localStorage.setItem('token', '')
    window.location.href='../../index.html'
}

function markComplete(id){
    console.log(id);
    // axios.put(`http://127.0.0.1:3000/api/v1/project/complete/${id}`, {
    //     headers: {
    //         "Content-Type": 'application/json',
    //         "Authorization": `Bearer ${token}`
    //     }
    // })
    // .then((response)=>{
    //     console.log(response);
    //     // window.location.reload();
    // })
    // .catch((e)=>{
    //     console.log(e.message);
    // })
}

document.querySelector('.logout').addEventListener('click', ()=>{
    logOut()
})