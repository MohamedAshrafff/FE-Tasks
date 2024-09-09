const firebaseConfig = {
  apiKey: "AIzaSyAfuuqSFlrS4Rhs_tnzk4J1AnkXe9XvoOI",
  authDomain: "todo-825ca.firebaseapp.com",
  projectId: "todo-825ca",
  storageBucket: "todo-825ca.appspot.com",
  messagingSenderId: "233213895048",
  appId: "1:233213895048:web:5b684e04aaa58e976f1a3d",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const tasksArray = [];
const tasksCompleted = [];

const taskForm = document.getElementById("task-form");

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const taskName = document.getElementById("task-name").value;
  const taskDescription = document.getElementById("task-description").value;
  const taskPriority = document.getElementById("task-priority").value;

  if (!taskName || !taskDescription || taskPriority === "") {
    alert("Please fill out all fields.");
    return;
  }

  try {
    const docRef = await db.collection("todos").add({
      name: taskName,
      description: taskDescription,
      priority: taskPriority,
      completed: false,
    });
    console.log("Task added with ID: ", docRef.id);
    renderTasks();
    taskForm.reset();
    location.reload();
  } catch (error) {
    console.error("Error adding task: ", error);
  }
});

// Rendering tasks
function renderTasks(
  filteredTasks = tasksArray,
  filteredCompletedTasks = tasksCompleted
) {
  const tasksList = document.getElementById("tasks-list");
  tasksList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add(
      "list-group-item",
      "d-flex",
      "d-flex",
      "justify-content-between"
    );
    taskElement.innerHTML = `
      <h4>${task.name}</h4>
      <p>${task.description}</p>
      <p>Priority: ${task.priority}</p>
      <button class="btn btn-success" onclick="completeTask('${task.id}')">Complete</button>
      <p class="badge bg-warning">Pending</p>
    `;
    tasksList.appendChild(taskElement);
  });

  filteredCompletedTasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.classList.add(
      "list-group-item",
      "bg-light",
      "text-muted",
      "d-flex",
      "justify-content-between"
    );
    taskElement.innerHTML = `
      <h4>${task.name}</h4>
      <p>${task.description}</p>
      <p>Priority: ${task.priority}</p>
      <p class="badge bg-success">Completed</p>
    `;
    tasksList.appendChild(taskElement);
  });
}

function completeTask(taskId) {
  try {
    db.collection("todos").doc(taskId).update({
      completed: true,
    });
    const taskIndex = tasksArray.findIndex((task) => task.id === taskId);
    const task = tasksArray.splice(taskIndex, 1);
    tasksCompleted.push(task[0]);
    renderTasks();
  } catch (error) {
    console.error("Error completing task: ", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const querySnapshot = await db.collection("todos").get();
    querySnapshot.forEach((doc) => {
      if (doc.data().completed) {
        tasksCompleted.push({ id: doc.id, ...doc.data() });
        return;
      } else tasksArray.push({ id: doc.id, ...doc.data() });
    });
    renderTasks(tasksArray);
  } catch (error) {
    console.error("Error fetching tasks: ", error);
  }
});

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
