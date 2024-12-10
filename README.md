Task Management App

 This application allows users to create and manage tasks, track their deadlines, and organize them into various status categories (e.g., Todo, In Progress, Completed, Overdue). Additionally, it provides a calendar to visualize tasks based on their deadlines and includes a feature for task deletion and restoration.

Features

1.	Task Creation:

2. 	Users can create tasks by filling in the title, description, and deadline.

  	Tasks are assigned an "Assigned Date" (the current date when the task is created).

3.	Task Management:

    Tasks can be moved between different statuses:

  	Todo: Tasks that are not started.

  	In Progress: Tasks currently being worked on.

    Completed: Tasks that are finished.
  
    Overdue: Tasks that have passed their deadline without completion.

4.	Task Editing and Deletion:
	
    Users can edit task details, including the title, description, and deadline.

  	Tasks can be deleted and moved to the "Deleted Tasks" section, where they can be permanently removed.

5.	Task Calendar:

    Tasks are displayed on a calendar according to their deadline.

    The user can view the current month, and navigate to previous or next months.

    Task markers on the calendar represent tasks with deadlines on specific days.

6.	Search and Filtering:

    Tasks can be searched by title or description.

    Users can filter tasks based on their current status (Todo, In Progress, Completed, Overdue).

7.	Notifications:

    Notifications will alert users when a task is overdue or due soon (within 24 hours).

    Notifications are displayed in the notification section for user awareness.

8.	Deleted Tasks:

    Deleted tasks are moved to a separate "Deleted" section and can be permanently removed.

    Deleted tasks can be viewed and are marked for permanent deletion if desired.

How It Works

1.	Task Creation:

    When a user submits the task form, a new task is created with the given details.

    The task is then displayed in the appropriate column based on its status (todo by default).

3.	Task Movement:

     Tasks can be moved from one status column to another (e.g., Todo to In Progress, In Progress to Completed) via action buttons in the task card.

4.	Overdue Task Detection:

    The app automatically checks for overdue tasks and moves them to the "Overdue" column if the deadline has passed.

5.	Calendar Integration:

    Tasks are displayed on the calendar, with each task represented by a small marker showing the task title on the day of its deadline.

6.	Task Deletion:
 
    Tasks can be deleted and moved to the "Deleted" section. From there, users can choose to permanently delete them from the system.

7.	Notifications:

    The app sends notifications for tasks that are either overdue or due soon (within 24 hours).

File Structure

     Task Tracker Application

    ├── index.html          # Main HTML structure for the app

    ├── app.js              # JavaScript file that powers the functionality

    └── style.css           # Optional CSS file for styling (not included in the provided code)

App UI

  •	Task Management Columns: Sections for "Todo", "In Progress", "Completed", and "Overdue" tasks.

  •	Calendar Section: Displays the current month with clickable days, each showing task markers for tasks with deadlines on that date.

  •	Notifications Section: Shows task-related alerts (e.g., overdue tasks, upcoming tasks).

  •	Deleted Tasks: Displays tasks that have been deleted and allows users to permanently remove them.

Periodic Checks

 The app runs periodic checks for overdue tasks every 20 seconds and every 3 hours (10,800 seconds) for checking task deadlines.
 Known Issues / To-Do

  • The task editing feature currently only allows simple title, description, and deadline changes.

  •	More advanced notification handling (e.g., browser push notifications) can be added in future versions.
