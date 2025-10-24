// src/services/api.js

// --- 1. USERS & PROJECTS MOCK DATA ---
// Added email field for all initial mock users for consistency
let mockUsers = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Project Manager' },
    { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com', role: 'Developer' },
    { id: 'user-3', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Tester' },
    { id: 'user-4', name: 'Diana Prince', email: 'diana@example.com', role: 'UX Designer' },
];
export const projectTypes = ['Scrum', 'Kanban', 'Basic'];
export const statuses = ['To Do', 'In Progress', 'Done', 'Review', 'Blocked'];

let projects = [
    {
        id: 'PROJ-001',
        name: 'Tasked App Core',
        key: 'TASKD',
        type: 'Kanban',
        managerId: 'user-1',
        memberIds: ['user-1', 'user-2', 'user-3', 'user-4'],
        tasks: [
            { id: 'TASKD-1', summary: 'Setup React structure', status: 'Done', priority: 'High', assigneeId: 'user-2', description: 'Initialize the app and set up routing.' },
            { id: 'TASKD-2', summary: 'Implement drag-and-drop', status: 'In Progress', priority: 'High', assigneeId: 'user-2', description: 'Use native D&D events to move cards between columns.' },
            { id: 'TASKD-3', summary: 'Design Project List Page', status: 'To Do', priority: 'Medium', assigneeId: 'user-4', description: 'Create a clean, functional design for the project selection list.' },
            { id: 'TASKD-4', summary: 'Write API mock data', status: 'Blocked', priority: 'High', assigneeId: 'user-3', description: 'Create and refine mock data for users, projects, and tasks.' },
        ],
    },
    {
        id: 'PROJ-002',
        name: 'Marketing Campaign Launch',
        key: 'MKTG',
        type: 'Scrum',
        managerId: 'user-4',
        memberIds: ['user-1', 'user-4'],
        tasks: [
            { id: 'MKTG-1', summary: 'Finalize ad copy', status: 'Done', priority: 'Medium', assigneeId: 'user-4', description: 'Review and approve all marketing ad copy.' },
            { id: 'MKTG-2', summary: 'Schedule social posts', status: 'In Progress', priority: 'Low', assigneeId: 'user-1', description: 'Schedule all posts for the first week of the campaign.' },
        ],
    },
];

const API_DELAY = 300; // Simulate network latency

// --- 2. LOCAL STORAGE MANAGEMENT ---
const loadProjects = () => {
    try {
        const storedProjects = localStorage.getItem('taskedProjects');
        if (storedProjects) {
            projects = JSON.parse(storedProjects);
        }
    } catch (e) {
        console.error("Could not load projects from local storage:", e);
    }
};

// NEW: Load users from local storage
const loadUsers = () => {
    try {
        const storedUsers = localStorage.getItem('taskedUsers');
        if (storedUsers) {
            mockUsers = JSON.parse(storedUsers);
        }
    } catch (e) {
        console.error("Could not load users from local storage:", e);
    }
};

// Update: Saves both projects and users (if users change, which can happen in addProjectMember)
const saveProjects = (currentProjects) => {
    try {
        localStorage.setItem('taskedProjects', JSON.stringify(currentProjects));
        localStorage.setItem('taskedUsers', JSON.stringify(mockUsers)); // Always save users when saving projects
    } catch (e) {
        console.error("Could not save data to local storage:", e);
    }
};

// Load data immediately when the script runs
loadProjects();
loadUsers(); // Load users as well

// Helper to get user name for tasks and projects
const getUserName = (id) => {
    const user = mockUsers.find(u => u.id === id);
    // If user is not found, it means they might have been added on another machine/session 
    // but the local storage hasn't been synced. Return a placeholder.
    return user ? user.name : 'Unassigned (ID: ' + id + ')';
};

// --- 3. API FUNCTIONS ---

// Gets all users (now potentially including dynamically added users)
export const getAllUsers = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ status: 200, data: mockUsers });
        }, API_DELAY);
    });
};

// Gets the list of all projects for the ProjectList page
export const getProjects = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ status: 200, data: projects });
        }, API_DELAY);
    });
};

// Gets details for a single project (used by KanbanBoard and TaskDetail)
export const getProjectDetails = (projectKey) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const project = projects.find(p => p.key === projectKey);
            if (project) {
                // Populate task assignee names for display
                const populatedTasks = project.tasks.map(task => ({
                    ...task,
                    assigneeName: getUserName(task.assigneeId)
                }));

                const members = project.memberIds.map(id => {
                    // Use mockUsers (which may contain new users)
                    const user = mockUsers.find(u => u.id === id);
                    return user ? { id: user.id, name: user.name, role: user.role } : { id, name: 'Unknown User', role: 'N/A' };
                });

                resolve({
                    status: 200,
                    data: { ...project, tasks: populatedTasks },
                    members: members,
                    statuses: statuses,
                    allUsers: mockUsers, // Provide all users (including new ones) for task assignment dropdowns
                });
                return;
            }
            resolve({ status: 404, error: 'Project not found' });
        }, API_DELAY);
    });
};

// Updates a single field in a task (used by TaskDetail and KanbanBoard for drag-and-drop)
export const updateTask = (projectKey, taskId, updates) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const projectIndex = projects.findIndex(p => p.key === projectKey);
            if (projectIndex !== -1) {
                const taskIndex = projects[projectIndex].tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    projects[projectIndex].tasks[taskIndex] = {
                        ...projects[projectIndex].tasks[taskIndex],
                        ...updates, // updates includes status or assigneeId
                    };
                    saveProjects(projects);
                    resolve({ status: 200, data: projects[projectIndex].tasks[taskIndex] });
                    return;
                }
            }
            resolve({ status: 404, error: 'Task or Project not found' });
        }, API_DELAY);
    });
};

// Creates a new task (used by CreateTaskModal)
export const createTask = (projectKey, newTask) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const projectIndex = projects.findIndex(p => p.key === projectKey);
            if (projectIndex !== -1) {
                // Generate next task ID
                const nextIdNumber = projects[projectIndex].tasks.length + 1;
                const nextId = `${projectKey}-${nextIdNumber}`;

                const taskWithId = {
                    ...newTask,
                    id: nextId.toUpperCase(),
                    assigneeId: newTask.assigneeId || ''
                };
                projects[projectIndex].tasks.push(taskWithId);
                saveProjects(projects);
                resolve({ status: 201, data: taskWithId });
                return;
            }
            resolve({ status: 404, error: 'Project not found' });
        }, API_DELAY);
    });
};

// Creates a new project (used by CreateProjectModal)
export const createProject = (newProjectData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 1. Check if key already exists
            if (projects.some(p => p.key === newProjectData.key.toUpperCase())) {
                reject({ status: 409, message: `Project key '${newProjectData.key.toUpperCase()}' already exists.` });
                return;
            }

            // 2. Generate new unique ID for the project
            const nextIdNumber = projects.length + 1;
            const nextId = `PROJ-${String(nextIdNumber).padStart(3, '0')}`; // e.g., PROJ-003

            // 3. Construct the new project object
            const newProject = {
                id: nextId,
                name: newProjectData.name,
                key: newProjectData.key.toUpperCase(),
                type: newProjectData.type,
                managerId: newProjectData.managerId,
                memberIds: [newProjectData.managerId], // Manager is the initial member
                tasks: [], // Starts with an empty task list
            };

            // 4. Add to list and save
            projects.push(newProject);
            saveProjects(projects);

            resolve({ status: 201, data: newProject, message: `Project ${newProject.key} created successfully.` });
        }, API_DELAY);
    });
};

// Adds a member to an existing project (used by ProjectSettings)
export const addProjectMember = (projectKey, email) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const projectIndex = projects.findIndex(p => p.key === projectKey);
            const normalizedEmail = email.toLowerCase().trim();

            if (projectIndex === -1) {
                return reject({ status: 404, message: `Project ${projectKey} not found.` });
            }

            // 1. Try to find existing user by email
            let existingUser = mockUsers.find(u => u.email === normalizedEmail);
            let userId;
            let message;

            if (existingUser) {
                userId = existingUser.id;
                message = `Existing user ${existingUser.name} added to project.`;
            } else {
                // 2. User does not exist - Create a new user (mocking registration)
                const nextUserIdNumber = mockUsers.length + 1;
                const newUserId = `user-${nextUserIdNumber}`;
                const newUserName = normalizedEmail.split('@')[0]; // Use the part before @ as a default name

                const newUser = {
                    id: newUserId,
                    // Capitalize the first letter of the default name
                    name: newUserName.charAt(0).toUpperCase() + newUserName.slice(1),
                    email: normalizedEmail,
                    role: 'Unassigned', // Default role for new users
                };

                mockUsers.push(newUser); // Add new user to mock data
                userId = newUserId;
                message = `New user ${newUser.name} created and added to project.`;
            }

            // 3. Check if user is already a member
            if (projects[projectIndex].memberIds.includes(userId)) {
                return reject({ status: 409, message: 'User is already a member of this project.' });
            }

            // 4. Add the user ID to the project members list
            projects[projectIndex].memberIds.push(userId);

            // 5. Save both updated projects and users
            saveProjects(projects);

            resolve({ status: 200, message: message, newUserId: userId });

        }, API_DELAY);
    });
};
