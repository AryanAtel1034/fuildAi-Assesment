const tasksElement = document.getElementById("tasks");
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const countElement = document.getElementById("count");
const statusElement = document.getElementById("status");

async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");
        if (!response.ok) throw new Error("API unavailable");

        const tasks = await response.json();
        statusElement.textContent = "API healthy";
        renderTasks(tasks);
    } catch (error) {
        statusElement.textContent = "API unavailable";
        tasksElement.innerHTML = '<div class="empty">Unable to load tasks.</div>';
    }
}

function renderTasks(tasks) {
    countElement.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;

    if (tasks.length === 0) {
        tasksElement.innerHTML = '<div class="empty">No tasks yet. Add your first task above.</div>';
        return;
    }

    tasksElement.innerHTML = tasks.map(task => `
        <div class="task ${task.completed ? "completed" : ""}">
            <input class="checkbox" type="checkbox"
                   ${task.completed ? "checked" : ""}
                   onchange="toggleTask(${task.id}, this.checked)">
            <span class="task-title">${escapeHtml(task.title)}</span>
            <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join("");
}

async function addTask(title) {
    const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title})
    });

    if (!response.ok) {
        throw new Error("Could not create task");
    }
}

async function toggleTask(id, completed) {
    const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({completed})
    });

    if (!response.ok) {
        alert("Could not update task.");
    }

    await loadTasks();
}

async function deleteTask(id) {
    const response = await fetch(`/api/tasks/${id}`, {method: "DELETE"});

    if (!response.ok) {
        alert("Could not delete task.");
        return;
    }

    await loadTasks();
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    if (!title) return;

    try {
        await addTask(title);
        titleInput.value = "";
        await loadTasks();
    } catch (error) {
        alert(error.message);
    }
});

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadTasks();
