// User database (no admin privileges)
const users = {
  Shubham: { password: "shubham123" },
  Rajdeep: { password: "rajdeep123" },
  Arnab: { password: "arnab123" },
  Abhi: { password: "abhi123" }
};

// Default tasks
const defaultTasks = {
  Shubham: [
    { text: "DSA Question", done: false },
    { text: "Academics [1 hour]", done: false },
    { text: "Gym", done: false },
    { text: "Development/Projects", done: false }
  ],
  Rajdeep: [
    { text: "Running/Basketball", done: false },
    { text: "Code", done: false },
    { text: "Academics [1 hour]/3 ALA Q", done: false }
  ],
  Arnab: [
    { text: "Gym", done: false },
    { text: "Academics [2 hours]", done: false },
    { text: "Leetcode 2 Q", done: false }
  ],
  Abhi: [
    { text: "No Gym", done: false },
    { text: "No Academics [2 hours]", done: false },
    { text: "Leetcode 3 Q", done: false }
  ]
};
//user names and password stored in local storage



// DOM Elements
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const currentUserSpan = document.getElementById('current-user');
const userSelect = document.getElementById('user-select');
const userNameSpan = document.getElementById('user-name');
const editControls = document.getElementById('edit-controls');
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const logoutBtn = document.getElementById('logout-btn');

const todayKey = `daily-checkins-${new Date().toISOString().slice(0, 10)}`;
let currentUser = null;
let viewingUser = null;
let allTasks = JSON.parse(JSON.stringify(defaultTasks));

// Initialize app
function initApp() {
  const savedTasks = JSON.parse(localStorage.getItem(todayKey));
  if (savedTasks) {
    for (const user in savedTasks) {
      if (allTasks[user]) {
        allTasks[user] = savedTasks[user];
      }
    }
  }
  
  const loggedInUser = sessionStorage.getItem('dailyCheckinsUser');
  if (loggedInUser && users[loggedInUser]) {
    currentUser = loggedInUser;
    viewingUser = currentUser;
    showApp();
  }
  
  updateUserSelect();
}

function updateUserSelect() {
  userSelect.innerHTML = Object.keys(users)
    .map(user => `<option value="${user}">${user}</option>`)
    .join('');
}

// Login
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (users[username] && users[username].password === password) {
    currentUser = username;
    viewingUser = currentUser;
    sessionStorage.setItem('dailyCheckinsUser', username);
    showApp();
  } else {
    alert('Invalid username or password');
  }
});

function showApp() {
  loginContainer.style.display = 'none';
  appContainer.style.display = 'block';
  currentUserSpan.textContent = currentUser;
  userSelect.value = viewingUser;
  renderList();
}

// View different user's tasks
userSelect.addEventListener('change', function(e) {
  viewingUser = e.target.value;
  renderList();
});

// Render task list
function renderList() {
  todoList.innerHTML = '';
  const tasks = allTasks[viewingUser] || [];
  const isViewingOwnTasks = viewingUser === currentUser;
  
  // Show/hide edit controls
  editControls.style.display = isViewingOwnTasks ? 'block' : 'none';
  
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span style="text-decoration: ${task.done ? 'line-through' : 'none'}">
        ${task.text}
      </span>
      ${isViewingOwnTasks ? `
        <button onclick="toggleDone(${index})">✅</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      ` : ''}
    `;
    todoList.appendChild(li);
  });

  userNameSpan.textContent = viewingUser;
}

// Task functions
function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    allTasks[currentUser].push({ text, done: false });
    taskInput.value = '';
    saveTasks();
    renderList();
  }
}
function toggleDone(index) {
  allTasks[currentUser][index].done = !allTasks[currentUser][index].done;
  saveTasks();
  renderList();
}

function deleteTask(index) {
  allTasks[currentUser].splice(index, 1);
  saveTasks();
  renderList();
}

function saveTasks() {
  localStorage.setItem(todayKey, JSON.stringify(allTasks));
}

// Logout
logoutBtn.addEventListener('click', function() {
  sessionStorage.removeItem('dailyCheckinsUser');
  currentUser = null;
  viewingUser = null;
  appContainer.style.display = 'none';
  loginContainer.style.display = 'block';
  loginForm.reset();
});

// Event listeners
addBtn.addEventListener('click', addTask);

// Initialize
initApp();