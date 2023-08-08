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
            <td>${project.project_status}</td>
            <td>${project.end_date.split('T')[0]}</td>
            <td><a href="./project.html?id=${project.id}" class="btn btn-primary">Mark Complete</a></td>
        `
        projects_table.appendChild(tr)
    })
}

// loading all users
const fetchAllUsers = async () => {
    const response = await fetch('http://127.0.0.1:8003/api/v1/employees', {
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    const data = await response.json()
    return data
}

// load all users to the DOM
const loadAllUsers = async () => {
    const users_table = document.querySelector('#all-users-table')
    const users = await fetchAllUsers()
    const all_users = users.employees
    users_table.innerHTML = ''
    all_users.forEach((user) => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${user.first_name} ${user.last_name}<br>
            <span class="small-uid">
                <small>123456789</small>
            </span>
            
            </td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><a href=".user.html?id=${user.id}" class="btn btn-primary">View</a></td>
        `
        users_table.appendChild(tr)
    }
    )
}

// dashboard stats
const fetchDashboardStats = async () => {
    const all_projects = await fetchAllProjects()
    const all_users = await fetchAllUsers()

    const projects = all_projects.projects
    const users = all_users.employees

    const total_projects = projects.length
    const total_users = users.length

    const completed_projects = projects.filter((project) => project.is_completed == 1).length
    const ongoing_projects = projects.filter((project) => project.is_completed == 0).length

    const unapproved_users = users.filter((user) => user.is_verified == 0)
    const recent_projects = projects.filter((project) => project.is_allocated == 0)

    const dashboard_stats = {
        total_projects,
        total_users,
        completed_projects,
        ongoing_projects,
        unapproved_users,
        recent_projects
    }

    return dashboard_stats
}


// load dashboard stats to the DOM
const loadDashboardStats = async () => {
    const usersCount = document.getElementById('users_count');
    const projectsCount = document.getElementById('projects_count');
    const completedProjectsCount = document.getElementById('completed_projects_count');
    const pendingProjectsCount = document.getElementById('pending_projects_count');
    const unapproved_users_table = document.getElementById('unapproved-users-table')
    const recent_projects_table = document.getElementById('recent-projects-table')

    const dashboard_stats = await fetchDashboardStats()

    usersCount.innerText = dashboard_stats.total_users
    projectsCount.innerText = dashboard_stats.total_projects
    completedProjectsCount.innerText = dashboard_stats.completed_projects
    pendingProjectsCount.innerText = dashboard_stats.ongoing_projects

    unapproved_users_table.innerHTML = ''
    dashboard_stats.unapproved_users.forEach((user) => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${user.first_name} ${user.last_name}<br>
            <span class="small-uid">
                <small>123456789</small>
            </span>
            </td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><a href="./user.html?id=${user.id}" class="btn btn-primary">View</a></td>
        `
        unapproved_users_table.appendChild(tr)
    }
    )

    recent_projects_table.innerHTML = ''
    dashboard_stats.recent_projects.forEach((project) => {
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${project.project_name}</td>
            <td>${project.project_status}</td>
            <td>${project.end_date.split('T')[0]}</td>
            <td><a href="./project.html?id=${project.id}" class="btn btn-primary">Allocate</a></td>
        `
        recent_projects_table.appendChild(tr)
    }
    )
}


const createNewProject = async (project_name, project_description, project_status, start_date, end_date) => {
    const response = await fetch('http://127.0.0.1:8003/api/v1/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization_token': `${token}`
        },
        body: JSON.stringify({
            project_name,
            project_description,
            project_status,
            start_date,
            end_date
        })
    })
    const data = await response.json()
    return data
}


// submit new project
const submitNewProject = async (e) => {
    e.preventDefault()
    const projectName = document.getElementById('newProjectName').value;
    const projectDescription = document.getElementById('newProjectDescription').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const newProject = await createNewProject(projectName, projectDescription, 0, startDate, endDate)
    if (newProject.status == 'success') {
        alert('Project created successfully')
        window.location.href = './dashboard.html'
    }
    else {
        alert('Project creation failed')
    }
}
