const fixedTasks = {
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
      ]
    };

    const userSelect = document.getElementById('user-select');
    const userNameSpan = document.getElementById('user-name');
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    const todayKey = `daily-checkins-${new Date().toISOString().slice(0, 10)}`;
    let currentUser = 'Shubham';

    let allTasks = JSON.parse(localStorage.getItem(todayKey)) || { ...structuredClone(fixedTasks) };

    function renderList() {
      userNameSpan.textContent = currentUser;
      todoList.innerHTML = '';
      const todos = allTasks[currentUser] || [];

      todos.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = currentUser !== 'Shubham' ? 'readonly' : '';
        li.innerHTML = `
          <span style="text-decoration: ${task.done ? 'line-through' : 'none'}">${task.text}</span>
          ${currentUser === 'Shubham' ? `
            <button onclick="toggleDone(${index})">✅</button>
            <button onclick="deleteTask(${index})">🗑️</button>` : ''}
        `;
        todoList.appendChild(li);
      });

      const editable = currentUser === 'Shubham';
      taskInput.disabled = !editable;
      addBtn.disabled = !editable;
    }

    function saveTasks() {
      localStorage.setItem(todayKey, JSON.stringify(allTasks));
    }

    function addTask() {
      const text = taskInput.value.trim();
      if (text !== '') {
        allTasks.Shubham.push({ text, done: false });
        taskInput.value = '';
        saveTasks();
        renderList();
      }
    }

    function toggleDone(index) {
      allTasks.Shubham[index].done = !allTasks.Shubham[index].done;
      saveTasks();
      renderList();
    }

    function deleteTask(index) {
      allTasks.Shubham.splice(index, 1);
      saveTasks();
      renderList();
    }

    userSelect.addEventListener('change', () => {
      currentUser = userSelect.value;
      renderList();
    });

    addBtn.addEventListener('click', addTask);

    renderList();