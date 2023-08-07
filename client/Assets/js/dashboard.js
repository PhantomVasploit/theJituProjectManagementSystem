const token = localStorage.token
const user = JSON.parse(localStorage.user)

// load all projects
const fetchAllProjects = async () => {
    const response = await fetch('http://127.0.0.1:8003/api/v1/projects', {
        headers: {
            'Content-Type': 'application/json',
            'authorization_token': `${token}`
        }
    })
    const data = await response.json()
    return data
}

// load the projects to the DOM
const loadAllProjects = async () => {
    const projects_table = document.querySelector('#all-projects-table')
    const projects = await fetchAllProjects()
    const all_projects = projects.projects
    projects_table.innerHTML = ''
    all_projects.forEach((project) => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${project.project_name}</td>
            <td>0</td>
            <td>${project.end_date.split('T')[0]}</td>
            <td><a href="project.html?id=${project.id}" class="btn btn-primary">View</a></td>
        `
        projects_table.appendChild(tr)
    })
}

// loading all users
const fetchAllUsers = async () => {
    const response = await fetch('http://127.0.0.1:8003/api/v1/employees', {
        headers: {
            'Content-Type': 'application/json',
            'authorization_token': `${token}`
        }
    })
    const data = await response.json()
    return data
}

// load all users to the DOM
const loadAllUsers = async () => {
    const users_table = document.querySelector('#all-users-table')
    const users = await fetchAllUsers()
    const all_users = users.users
    users_table.innerHTML = ''
    all_users.forEach((user) => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${user.first_name} ${user.last_name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><a href="user.html?id=${user.id}" class="btn btn-primary">View</a></td>
        `
        users_table.appendChild(tr)
    }
    )
}

