const token = localStorage.token
const user = JSON.parse(localStorage.user)


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
                            <button>Done</button>
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
        const errorEl = document.querySelector('.error-message')
        const projectInfo = document.querySelector('.project-info')
        errorEl.innerHTML = e.response.data.error
        projectInfo.style.display = "none"
    })
}

loadData()


function toggleProjectDone(id){
    axios.p
}