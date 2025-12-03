const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const dueDateInput = document.getElementById('dueDateInput');
const addBtn = document.getElementById('addBtn');
const searchInput = document.getElementById('searchInput');
const filterAll = document.getElementById('filterAll');
const filterPending = document.getElementById('filterPending');
const filterDone = document.getElementById('filterDone');
const taskList = document.getElementById('taskList');
const STORAGE_KEY = 'akshay_tasks_v2';

let tasks = [];
let currentFilter = 'all';

function loadTasks() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  tasks = data;
  renderTasks();
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = currentFilter === 'all' ||
                         (currentFilter === 'pending' && !task.done) ||
                         (currentFilter === 'done' && task.done);
    const matchesSearch = task.text.toLowerCase().includes(searchInput.value.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const taskText = document.createElement('div');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const taskMeta = document.createElement('div');
    taskMeta.className = 'task-meta';

    const priorityBadge = document.createElement('span');
    priorityBadge.className = `priority-badge priority-${task.priority}`;
    priorityBadge.textContent = task.priority;

    const dueDate = document.createElement('span');
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      dueDate.textContent = `Due: ${date.toLocaleDateString()}`;
      if (date < new Date() && !task.done) {
        dueDate.style.color = '#dc3545';
        dueDate.style.fontWeight = 'bold';
      }
    }

    taskMeta.appendChild(priorityBadge);
    if (task.dueDate) taskMeta.appendChild(dueDate);

    taskContent.appendChild(taskText);
    taskContent.appendChild(taskMeta);

    const controls = document.createElement('div');
    controls.className = 'task-controls';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTask(index);

    const doneBtn = document.createElement('button');
    doneBtn.className = 'done-btn';
    doneBtn.textContent = task.done ? 'Undo' : 'Done';
    doneBtn.onclick = () => toggleTask(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(index);

    controls.appendChild(editBtn);
    controls.appendChild(doneBtn);
    controls.appendChild(deleteBtn);

    li.appendChild(taskContent);
    li.appendChild(controls);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (!text) return;

  const newTask = {
    text,
    priority,
    dueDate,
    done: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  taskInput.value = '';
  dueDateInput.value = '';
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const task = tasks[index];
  const newText = prompt('Edit task:', task.text);
  if (newText !== null && newText.trim()) {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.add('active');
  renderTasks();
}

// Event listeners
addBtn.onclick = addTask;
taskInput.onkeypress = (e) => { if (e.key === 'Enter') addTask(); };
searchInput.oninput = renderTasks;
filterAll.onclick = () => setFilter('all');
filterPending.onclick = () => setFilter('pending');
filterDone.onclick = () => setFilter('done');

// Initialize
window.addEventListener('DOMContentLoaded', loadTasks);
