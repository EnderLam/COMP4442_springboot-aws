let token = null;

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        token = data.token;
        localStorage.setItem('token', token);
        showTasks();
    } catch (err) {
        document.getElementById('loginError').innerText = err.message;
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error);
        }
        document.getElementById('regSuccess').innerText = 'Registration successful! Please login.';
        document.getElementById('regError').innerText = '';
        document.getElementById('registerForm').reset();
    } catch (err) {
        document.getElementById('regError').innerText = err.message;
    }
});

document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;
    const status = document.getElementById('taskStatus').value;
    try {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, status })
        });
        if (!res.ok) throw new Error('Failed to create task');
        document.getElementById('taskForm').reset();
        loadTasks();
    } catch (err) {
        alert(err.message);
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    token = null;
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('taskSection').style.display = 'none';
});

async function showTasks() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('taskSection').style.display = 'block';
    await loadTasks();
}

async function loadTasks() {
    const res = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem('token');
            location.reload();
        }
        return;
    }
    const tasks = await res.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div>
                <div class="task-title">${task.title}</div>
                <div class="task-desc">${task.description || ''}</div>
                <div class="task-status">${task.status}</div>
                <small>${new Date(task.creationDate).toLocaleString()}</small>
            </div>
            <button class="btn btn-sm btn-danger delete-task" data-id="${task.id}">Delete</button>
        `;
        taskList.appendChild(li);
    });
    document.querySelectorAll('.delete-task').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = btn.getAttribute('data-id');
            await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadTasks();
        });
    });
}

// Auto login if token exists
window.onload = () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
        token = savedToken;
        showTasks();
    }
};