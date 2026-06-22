const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");

const taskCounter = document.getElementById("taskCounter");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const themeBtn = document.getElementById("themeBtn");

const emptyState = document.getElementById("emptyState");

const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const saveEdit = document.getElementById("saveEdit");
const cancelEdit = document.getElementById("cancelEdit");

let tasks =
JSON.parse(
    localStorage.getItem("tasks")
) || [];

let currentFilter = "all";
let editingIndex = null;

/* Save */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* Update Stats */

function updateStats() {

    const total =
    tasks.length;

    const completed =
    tasks.filter(
        task => task.completed
    ).length;

    const pending =
    total - completed;

    taskCounter.textContent =
    `Tasks: ${total}`;

    totalCount.textContent =
    total;

    pendingCount.textContent =
    pending;

    completedCount.textContent =
    completed;

    if (total === 0) {

        emptyState.style.display =
        "block";

    } else {

        emptyState.style.display =
        "none";
    }
}

/* Add Task */

function addTask() {

    const text =
    taskInput.value.trim();

    if (text === "") return;

    tasks.push({

        text: text,

        completed: false,

        createdAt:
        new Date()
        .toLocaleDateString()
    });

    taskInput.value = "";

    saveTasks();

    renderTasks();
}

/* Render Tasks */

function renderTasks() {

    taskList.innerHTML = "";

    const search =
    searchInput.value
    .toLowerCase();

    const filteredTasks =
    tasks.filter(task => {

        const matchesSearch =
        task.text
        .toLowerCase()
        .includes(search);

        if (
            currentFilter ===
            "completed"
        ) {

            return (
                matchesSearch &&
                task.completed
            );
        }

        if (
            currentFilter ===
            "pending"
        ) {

            return (
                matchesSearch &&
                !task.completed
            );
        }

        return matchesSearch;
    });

    filteredTasks.forEach(task => {

        const realIndex =
        tasks.indexOf(task);

        const li =
        document.createElement("li");

        /* Left Side */

        const taskWrapper =
        document.createElement("div");

        taskWrapper.style.flex =
        "1";

        const taskText =
        document.createElement("div");

        taskText.className =
        "task-text";

        taskText.textContent =
        task.text;

        if (
            task.completed
        ) {

            taskText.classList.add(
                "completed"
            );
        }

        const taskDate =
        document.createElement("small");

        taskDate.textContent =
        "Created: " +
        task.createdAt;

        taskDate.style.display =
        "block";

        taskDate.style.marginTop =
        "5px";

        taskDate.style.opacity =
        "0.7";

        taskWrapper.appendChild(
            taskText
        );

        taskWrapper.appendChild(
            taskDate
        );

        /* Buttons */

        const actions =
        document.createElement("div");

        actions.className =
        "actions";

        /* Complete */

        const completeBtn =
        document.createElement(
            "button"
        );

        completeBtn.className =
        "complete-btn";

        completeBtn.textContent =
        task.completed
        ? "Undo"
        : "Complete";

        completeBtn.addEventListener(
            "click",
            () => {

                tasks[
                    realIndex
                ].completed =
                !tasks[
                    realIndex
                ].completed;

                saveTasks();

                renderTasks();
            }
        );

        /* Edit */

        const editBtn =
        document.createElement(
            "button"
        );

        editBtn.className =
        "edit-btn";

        editBtn.textContent =
        "Edit";

        editBtn.addEventListener(
            "click",
            () => {

                editingIndex =
                realIndex;

                editInput.value =
                task.text;

                editModal.style.display =
                "flex";
            }
        );

        /* Delete */

        const deleteBtn =
        document.createElement(
            "button"
        );

        deleteBtn.className =
        "delete-btn";

        deleteBtn.textContent =
        "Delete";

        deleteBtn.addEventListener(
            "click",
            () => {

                tasks.splice(
                    realIndex,
                    1
                );

                saveTasks();

                renderTasks();
            }
        );

        actions.appendChild(
            completeBtn
        );

        actions.appendChild(
            editBtn
        );

        actions.appendChild(
            deleteBtn
        );

        li.appendChild(
            taskWrapper
        );

        li.appendChild(
            actions
        );

        taskList.appendChild(
            li
        );
    });

    updateStats();
}

/* Save Edit */

saveEdit.addEventListener(
    "click",
    () => {

        const newText =
        editInput.value.trim();

        if (
            newText !== "" &&
            editingIndex !== null
        ) {

            tasks[
                editingIndex
            ].text =
            newText;

            saveTasks();

            renderTasks();

            editModal.style.display =
            "none";
        }
    }
);

/* Cancel Edit */

cancelEdit.addEventListener(
    "click",
    () => {

        editModal.style.display =
        "none";
    }
);

/* Close Modal */

window.addEventListener(
    "click",
    e => {

        if (
            e.target ===
            editModal
        ) {

            editModal.style.display =
            "none";
        }
    }
);

/* Search */

searchInput.addEventListener(
    "input",
    renderTasks
);

/* Filters */

allBtn.addEventListener(
    "click",
    () => {

        currentFilter =
        "all";

        renderTasks();
    }
);

pendingBtn.addEventListener(
    "click",
    () => {

        currentFilter =
        "pending";

        renderTasks();
    }
);

completedBtn.addEventListener(
    "click",
    () => {

        currentFilter =
        "completed";

        renderTasks();
    }
);

/* Dark Mode */

themeBtn.addEventListener(
    "click",
    () => {

        document.body
        .classList.toggle(
            "light"
        );
    }
);

/* Add Task Button */

addBtn.addEventListener(
    "click",
    addTask
);

/* Enter Key */

taskInput.addEventListener(
    "keydown",
    e => {

        if (
            e.key ===
            "Enter"
        ) {

            addTask();
        }
    }
);

/* Start */

renderTasks();