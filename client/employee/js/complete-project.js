const token = localStorage.token == null || undefined ? localStorage.setItem('token', null) : localStorage.token
const user = JSON.parse(localStorage.user) == null || undefined ? localStorage.setItem('user', null) : JSON.parse(localStorage.user)

function checkData(){
    if(user == undefined  || token == undefined || user == null || token || null ){
        window.location.href = '../../index.html'
    }
}

window.onload = checkData

function loadData(){
    axios.get('http://127.0.0.1:3000/api/v1/projects', {
        headers: {
            'Authorization': 'application/json',
            'authorization_token': token
        }
    })
    .then((response)=>{
        const errorEl = document.querySelector('.error')
        const projectInfo = document.querySelector('.project-info')
        let projectHtml = ''
        errorEl.style.display = "none"
        response.data.projects.forEach((project)=>{
            projectHtml += `
                <div class="project-card">
                    <div class="top">
                        <h4>${project.project_name}</h4>
                        <div class="btn">
                            
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
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href('../../index.html')
}

document.querySelector('.logout').addEventListener('click', ()=>{
    logOut()
})