const tasksArray = [];
const tasksCompleted = [];

function generateId() {
  return Math.random().toString(36);
}

document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const taskName = document.getElementById("task-name").value;
  const taskDescription = document.getElementById("task-description").value;
  const taskPriority = document.getElementById("task-priority").value;

  if (taskName === "" || taskDescription === "" || taskPriority === "") {
    alert("Please fill out all fields");
    return;
  }

  const task = {
    id: generateId(),
    name: taskName,
    description: taskDescription,
    priority: taskPriority,
    completed: false,
  };

  addTask(task);
  renderTasks();
  clearForm();
});

function addTask(task) {
  tasksArray.push(task);
  tasksArray.sort((a, b) => a.priority - b.priority);
}

function completeTask(id) {
  const taskIndex = tasksArray.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasksArray[taskIndex].completed = true;
    tasksCompleted.push(tasksArray.splice(taskIndex, 1)[0]);
    renderTasks();
  }
}

function renderTasks(
  filteredTasks = tasksArray,
  filteredCompletedTasks = tasksCompleted
) {
  const tasksList = document.getElementById("tasks-list");
  tasksList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add("list-group-item");
    taskElement.innerHTML = `
        <h3>${task.name}</h3>
        <p>${task.description}</p>
        <p>Priority: ${task.priority}</p>
        <p class="badge bg-warning">Pending</p>
        <button class="btn btn-success" onclick="completeTask('${task.id}')">Complete</button>
      `;
    tasksList.appendChild(taskElement);
  });

  // Render completed tasks at the end
  filteredCompletedTasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add("list-group-item", "bg-light", "text-muted");
    taskElement.innerHTML = `
        <h3>${task.name}</h3>
        <p>${task.description}</p>
        <p>Priority: ${task.priority}</p>
        <p class="badge bg-success">Completed</p>
      `;
    tasksList.appendChild(taskElement);
  });
}

function clearForm() {
  document.getElementById("task-name").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("task-priority").value = "0";
}

document.getElementById("search-input").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();

  const filteredTasks = tasksArray.filter((task) =>
    task.name.toLowerCase().includes(searchTerm)
  );
  const filteredCompletedTasks = tasksCompleted.filter((task) =>
    task.name.toLowerCase().includes(searchTerm)
  );

  renderTasks(filteredTasks, filteredCompletedTasks);
});
