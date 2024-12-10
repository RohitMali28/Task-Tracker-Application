// app.js

// Elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const taskDeadlineInput = document.getElementById('task-deadline');

const todoColumn = document.getElementById('todo-tasks');
const inProgressColumn = document.getElementById('in-progress-tasks');
const completedColumn = document.getElementById('completed-tasks');
const overdueColumn = document.getElementById('overdue-tasks');

const calendarSection = document.getElementById('calendar-section');
const deletedSection = document.getElementById('deleted-section');
const analyticsSection = document.getElementById('analytics-section');
const notificationsSection = document.getElementById('notifications-section');

const taskSearchInput = document.getElementById('task-search');
const taskFilterSelect = document.getElementById('task-filter');

// Sidebar links
const tasksLink = document.getElementById('tasks-link');
const calendarLink = document.getElementById('calendar-link');
const deletedLink = document.getElementById('deleted-link');
const analyticsLink = document.getElementById('analytics-link');
const notificationsLink = document.getElementById('notifications-link');

// Task list
let tasks = [];
let currentMonth = new Date().getMonth(); // 0-based month index (0 = January)
let currentYear = new Date().getFullYear();
let selectedDate = null; // Variable to store the selected date

// Handle form submission
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    const deadline = taskDeadlineInput.value;

    if (title && description && deadline) {
        const assignedDate = new Date().toLocaleDateString('en-US'); // Assign the date at the time of creation

        const formattedDeadline = new Date(deadline).toLocaleDateString('en-US'); // Format the deadline date

        const newTask = {
            id: Date.now(),
            title,
            description,
            deadline: formattedDeadline, // Store formatted deadline
            assignedDate, // Store assigned date (this won't change)
            status: 'todo',
        };

        tasks.push(newTask);
        addTaskToColumn(newTask);
    }

    // Clear input fields after task is added
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    taskDeadlineInput.value = '';
});

// Add task to the appropriate column
function addTaskToColumn(task) {
    const currentDate = new Date();
    const taskDeadline = new Date(task.deadline);

    // Check if the task is overdue
    if (taskDeadline < currentDate) {
        task.status = 'overdue'; // Automatically set task status to 'overdue'
    }

    const taskCard = createTaskCard(task);

    // Add task to the appropriate column
    switch (task.status) {
        case 'todo':
            todoColumn.appendChild(taskCard);
            break;
        case 'in-progress':
            inProgressColumn.appendChild(taskCard);
            break;
        case 'completed':
            completedColumn.appendChild(taskCard);
            break;
        case 'overdue':
            overdueColumn.appendChild(taskCard);
            break;
    }

    // Now add the task to the calendar based on its deadline
    addTaskToCalendar(task);
}

// Add task to the calendar on the correct date
// Add task to the calendar on the correct date
function addTaskToCalendar(task) {
    const calendarCells = document.querySelectorAll('#calendar td');
    const taskDeadline = new Date(task.deadline);
    const taskDay = taskDeadline.getDate();
    
    // Find the correct calendar cell based on the task's deadline
    calendarCells.forEach(cell => {
        const cellDate = parseInt(cell.textContent);

        // Check if the cell corresponds to the task's deadline
        if (cellDate === taskDay) {
            const taskMarker = document.createElement('span');
            taskMarker.classList.add('task-marker');
            taskMarker.textContent = task.title;

            // Add task marker to the calendar cell
            cell.appendChild(taskMarker);
        }
    });
}
// Create a task card with a three-dot menu
function createTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.setAttribute('data-id', task.id);

    taskCard.innerHTML = `
        <div class="task-header">
            <h3>${task.title}</h3>
            <button class="task-menu-button">...</button>
        </div>
        <p>${task.description}</p>
        <p><strong>Assigned:</strong> ${task.assignedDate}</p>  <!-- Assigned date -->
        <p><strong>Deadline:</strong> ${task.deadline}</p> <!-- Formatted deadline -->
        <div class="task-actions hidden">
            <button class="move-to-progress">Move to In Progress</button>
            <button class="move-to-completed">Mark as Completed</button>
            <button class="edit-task">Edit Task</button>
            <button class="delete-task">Delete Task</button>
        </div>
    `;

    const taskMenuButton = taskCard.querySelector('.task-menu-button');
    const taskActions = taskCard.querySelector('.task-actions');
    const moveToProgressButton = taskCard.querySelector('.move-to-progress');
    const moveToCompletedButton = taskCard.querySelector('.move-to-completed');
    const deleteButton = taskCard.querySelector('.delete-task');
    const editButton = taskCard.querySelector('.edit-task');

    // Toggle the visibility of task actions when menu button is clicked
    taskMenuButton.addEventListener('click', function() {
        taskActions.classList.toggle('hidden');
    });

    // Move task to In Progress
    moveToProgressButton.addEventListener('click', function() {
        moveTaskStatus(task, 'in-progress');
    });

    // Mark task as Completed
    moveToCompletedButton.addEventListener('click', function() {
        moveTaskStatus(task, 'completed');
    });

    // Delete task
    deleteButton.addEventListener('click', function() {
        deleteTask(task);
    });

    // Edit task (functionality can be implemented separately)
    editButton.addEventListener('click', function() {
        editTask(task);
    });

    return taskCard;
}

// Move task to different column
function moveTaskStatus(task, newStatus) {
    task.status = newStatus;
    const taskCard = document.querySelector(`.task-card[data-id='${task.id}']`);
    const newColumn = getColumnByStatus(newStatus);
    newColumn.appendChild(taskCard);
}

// Get the column element based on task status
function getColumnByStatus(status) {
    switch (status) {
        case 'todo':
            return todoColumn;
        case 'in-progress':
            return inProgressColumn;
        case 'completed':
            return completedColumn;
        case 'overdue':
            return overdueColumn;
    }
}

// Delete a task and move to "Deleted Tasks"
function deleteTask(task) {
    // Remove task from the main tasks array
    tasks = tasks.filter(t => t.id !== task.id);

    // Remove the task card from the current column
    const taskCard = document.querySelector(`.task-card[data-id='${task.id}']`);
    taskCard.remove();

    // Move task to the Deleted Tasks section
    moveToDeletedTasks(task);
}

// Move the deleted task to the Deleted Tasks section
function moveToDeletedTasks(task) {
    const deletedTasksContainer = document.getElementById('deleted-tasks-container');
    
    const deletedTaskCard = document.createElement('div');
    deletedTaskCard.classList.add('deleted-task-card');
    deletedTaskCard.setAttribute('data-id', task.id);

    deletedTaskCard.innerHTML = `
        <div class="task-header">
            <h3>${task.title}</h3>
        </div>
        <p>${task.description}</p>
        <p><strong>Assigned:</strong> ${task.assignedDate}</p>
        <p><strong>Deadline:</strong> ${task.deadline}</p>
        <div class="deleted-task-actions">
            <button class="delete-permanently">Delete Permanently</button>
        </div>
    `;

    // Add the deleted task card to the container
    deletedTasksContainer.appendChild(deletedTaskCard);

    // Add event listener for permanently deleting the task
    const deletePermanentlyButton = deletedTaskCard.querySelector('.delete-permanently');
    deletePermanentlyButton.addEventListener('click', function() {
        permanentlyDeleteTask(task);
    });
}

// Permanently delete the task from the deleted tasks section
function permanentlyDeleteTask(task) {
    // Remove task from the deleted tasks array (tasks array already has the task removed)
    const deletedTaskCard = document.querySelector(`.deleted-task-card[data-id='${task.id}']`);
    deletedTaskCard.remove();

    // Optionally log or alert the user
    alert(`Task "${task.title}" has been permanently deleted.`);
}

// Sidebar navigation
tasksLink.addEventListener('click', function() {
    showSection('tasks');
});

calendarLink.addEventListener('click', function() {
    showSection('calendar');
});

deletedLink.addEventListener('click', function() {
    showSection('deleted');
});

analyticsLink.addEventListener('click', function() {
    showSection('analytics');
});

notificationsLink.addEventListener('click', function() {
    showSection('notifications');
});

// Show the selected section
function showSection(section) {
    const sections = ['tasks', 'calendar', 'deleted', 'analytics', 'notifications'];
    sections.forEach(s => {
        const sectionElement = document.getElementById(`${s}-section`);
        if (s === section) {
            sectionElement.classList.remove('hidden');
        } else {
            sectionElement.classList.add('hidden');
        }
    });
}

// Show the selected section
function showSection(section) {
    const sections = ['tasks', 'calendar', 'deleted', 'analytics', 'notifications'];
    sections.forEach(s => {
        const sectionElement = document.getElementById(`${s}-section`);
        if (s === section) {
            sectionElement.classList.remove('hidden');
        } else {
            sectionElement.classList.add('hidden');
        }
    });

    if (section === 'calendar') {
        generateCalendar(); // Call this function when calendar section is shown
    }
}

// Generate basic calendar UI with task markers
function updateMonthYearDisplay() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const displayElement = document.getElementById("current-month-year");
    displayElement.innerHTML = `${monthNames[currentMonth]} ${currentYear}`;
}

function generateCalendar() {
    const calendarContainer = document.getElementById('calendar');
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get number of days in the month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // Get the first day of the month (0 = Sunday)

    let calendarHTML = "<table><thead><tr>";
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    daysOfWeek.forEach(day => {
        calendarHTML += `<th>${day}</th>`;
    });

    calendarHTML += "</tr></thead><tbody><tr>";

    // Add blank cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += "<td></td>";
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
            calendarHTML += "</tr><tr>"; // New row for each week
        }
        calendarHTML += `<td data-day="${day}" class="calendar-day">${day}</td>`;
    }

    calendarHTML += "</tr></tbody></table>";
    calendarContainer.innerHTML = calendarHTML; // Update calendar UI

    // Update the current month/year display
    updateMonthYearDisplay();

    // Add task markers to the calendar
    tasks.forEach(task => {
        addTaskToCalendar(task); // Add task markers for the current month's tasks
    });
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('calendar-day')) {
        const selectedDay = parseInt(event.target.innerText);
        selectedDate = new Date(currentYear, currentMonth, selectedDay);

        // Remove the 'selected' class from all days (to clear previous selection)
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });

        // Add the 'selected' class to the clicked day
        event.target.classList.add('selected');

        // Update the displayed selected date at the top of the calendar section
        const selectedDateDisplay = document.getElementById("selected-date-display");
        if (!selectedDateDisplay) {
            const newDisplay = document.createElement('div');
            newDisplay.id = 'selected-date-display';
            document.getElementById('calendar-section').insertBefore(newDisplay, document.getElementById('calendar'));
        }

        const selectedDateElement = document.getElementById('selected-date-display');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateElement.innerHTML = `Selected Date: ${selectedDate.toLocaleDateString('en-US', options)}`;
    }
});
// Handle "Previous Month" button click
document.getElementById('prev-month-btn').addEventListener('click', function() {
    currentMonth--; // Move to the previous month
    if (currentMonth < 0) {
        currentMonth = 11; // If it's January, go to December
        currentYear--; // Decrease the year
    }
    generateCalendar(); // Regenerate the calendar for the new month
});

document.getElementById('next-month-btn').addEventListener('click', function() {
    currentMonth++; // Move to the next month
    if (currentMonth > 11) {
        currentMonth = 0; // If it's December, go to January
        currentYear++; // Increase the year
    }
    generateCalendar(); // Regenerate the calendar for the new month
});

// Edit task function (opens a prompt for the task's new details)
function editTask(task) {
    const newTitle = prompt('Edit Task Title:', task.title);
    const newDescription = prompt('Edit Task Description:', task.description);
    const newDeadline = prompt('Edit Task Deadline:', task.deadline);

    if (newTitle && newDescription && newDeadline) {
        // Update only title, description, and deadline, not the assigned date
        task.title = newTitle;
        task.description = newDescription;
        task.deadline = new Date(newDeadline).toLocaleDateString('en-US'); // Format the new deadline

        // Find the task card and update only the content (not the assigned date)
        const taskCard = document.querySelector(`.task-card[data-id='${task.id}']`);
        taskCard.querySelector('h3').textContent = task.title;
        taskCard.querySelector('p').textContent = task.description;
        taskCard.querySelector('p + p').textContent = `Deadline: ${task.deadline}`; // Update deadline paragraph
    }
}

function checkOverdueTasks() {
    const currentDate = new Date();

    tasks.forEach(task => {
        const taskDeadline = new Date(task.deadline);

        if (taskDeadline < currentDate && task.status !== 'overdue') {
            task.status = 'overdue';
            const taskCard = document.querySelector(`.task-card[data-id='${task.id}']`);
            const overdueColumn = getColumnByStatus('overdue');
            overdueColumn.appendChild(taskCard);
        }
    });
}

// Call this function periodically, e.g., every minute
setInterval(checkOverdueTasks, 20000); // 20000ms = 20 seconds

// Filter tasks based on search input and selected status
function filterTasks() {
    const searchQuery = taskSearchInput.value.toLowerCase();
    const selectedStatus = taskFilterSelect.value;

    // Clear all columns' tasks
    todoColumn.innerHTML = '';
    inProgressColumn.innerHTML = '';
    completedColumn.innerHTML = '';
    overdueColumn.innerHTML = '';

    // Filter tasks based on search query and selected status
    tasks.forEach(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery) || task.description.toLowerCase().includes(searchQuery);
        const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;

        if (matchesSearch && matchesStatus) {
            addTaskToColumn(task);
        }
    });

    // Show or hide columns based on selected status
    showRelevantColumn(selectedStatus);
}

// Function to show or hide columns based on selected filter
function showRelevantColumn(status) {
    // Hide all columns initially
    todoColumn.parentElement.classList.add('hidden');
    inProgressColumn.parentElement.classList.add('hidden');
    completedColumn.parentElement.classList.add('hidden');
    overdueColumn.parentElement.classList.add('hidden');

    // Show the relevant column based on selected status
    if (status === 'all') {
        todoColumn.parentElement.classList.remove('hidden');
        inProgressColumn.parentElement.classList.remove('hidden');
        completedColumn.parentElement.classList.remove('hidden');
        overdueColumn.parentElement.classList.remove('hidden');
    } else if (status === 'todo') {
        todoColumn.parentElement.classList.remove('hidden');
    } else if (status === 'in-progress') {
        inProgressColumn.parentElement.classList.remove('hidden');
    } else if (status === 'completed') {
        completedColumn.parentElement.classList.remove('hidden');
    } else if (status === 'overdue') {
        overdueColumn.parentElement.classList.remove('hidden');
    }
}

// Add event listeners to search input and filter dropdown
taskSearchInput.addEventListener('input', filterTasks);
taskFilterSelect.addEventListener('change', filterTasks);

// Function to check for overdue and upcoming tasks
function checkTaskDeadlines() {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // Get the date part only (YYYY-MM-DD)

    tasks.forEach(task => {
        const taskDeadline = new Date(task.deadline);
        const timeDifference = taskDeadline - currentDate; // Difference in milliseconds
        const dayDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days

        // If the task is overdue, move it to "Overdue" and send a notification
        if (dayDifference < 0 && task.status !== 'overdue') {
            task.status = 'overdue';
            moveTaskToOverdue(task);
            sendNotification(`${task.title} is overdue!`);
        }
        
        // If the task is due in less than 24 hours, notify the user about it
        else if (dayDifference >= 0 && dayDifference < 1 && task.status !== 'overdue') {
            sendNotification(`${task.title} is due soon!`);
        }
    });
}

// Function to send notifications
function sendNotification(message) {
    const notificationContainer = document.getElementById('notifications-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    notificationContainer.appendChild(notification);
}

function moveTaskToOverdue(task) {
    const taskElement = document.getElementById(`task-${task.id}`);
    const overdueColumn = document.getElementById('overdue-tasks');
    overdueColumn.appendChild(taskElement);
    taskElement.querySelector('.task-header').innerHTML = `<strong>Overdue:</strong> ${task.title}`;
}

function renderTasks() {
    const todoColumn = document.getElementById('todo-tasks');
    const inProgressColumn = document.getElementById('in-progress-tasks');
    const completedColumn = document.getElementById('completed-tasks');
    const overdueColumn = document.getElementById('overdue-tasks');

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-card');
        taskElement.id = `task-${task.id}`;

        taskElement.innerHTML = `
            <div class="task-header">
                <h3>${task.title}</h3>
            </div>
            <div class="task-actions">
                <button onclick="markTaskAsCompleted(${task.id})">Mark as Completed</button>
            </div>
        `;

        // Move task to the appropriate section based on its status
        if (task.status === 'todo') {
            todoColumn.appendChild(taskElement);
        } else if (task.status === 'in-progress') {
            inProgressColumn.appendChild(taskElement);
        } else if (task.status === 'completed') {
            completedColumn.appendChild(taskElement);
        } else if (task.status === 'overdue') {
            overdueColumn.appendChild(taskElement);
        }
    });
}

// Mark task as completed
function markTaskAsCompleted(taskId) {
    const task = tasks.find(t => t.id === taskId);
    task.status = 'completed';
    renderTasks();
}

// Call these functions on page load or at periodic intervals
renderTasks();
checkTaskDeadlines();  // Check task deadlines

setInterval(checkTaskDeadlines, 10800000); // Check every 10800 second