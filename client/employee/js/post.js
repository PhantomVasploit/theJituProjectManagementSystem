const token = localStorage.token
const user = JSON.parse(localStorage.user)

function loadPost(){
    axios.get(`http://127.0.0.1:3000/api/v1/projects/${user.id}`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer: ${token}`
        }
    })
    .then((response)=>{
        if(response.data.projects.length <= 0){
            const projectInfo = document.querySelector('.project-info')
            // projectInfo.innerHTML.style.display = "none"
            projectInfo.style.backgoundImage = `url${'../assests/3973481.jpg'}`
            projectInfo.style.backgoundSize = "cover"
            projectInfo.style.backgoundRepeat = "no-repeat"
        }else{
            // add data dynamically
        }
    })
    .catch((e)=>{
        const errorMessage = document.querySelector('.error')
        errorMessage.innerHTML = e.message
    })
}

loadPost()