// server/data/mockData.js
let mockUsers = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Project Manager' },
    { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com', role: 'Developer' },
    { id: 'user-3', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Tester' },
    { id: 'user-4', name: 'Diana Prince', email: 'diana@example.com', role: 'UX Designer' },
];

const statuses = ['To Do', 'In Progress', 'Done', 'Review', 'Blocked'];

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
            { id: 'TASKD-3', summary: 'Design component styles', status: 'To Do', priority: 'Medium', assigneeId: 'user-4', description: 'Create a clean, Jira-like aesthetic.' },
            { id: 'TASKD-4', summary: 'Connect to Node.js backend', status: 'Blocked', priority: 'Low', assigneeId: 'user-1', description: 'Placeholder task for future integration.' },
        ]
    },
    {
        id: 'PROJ-002',
        name: 'Marketing Website',
        key: 'WEB',
        type: 'Scrum',
        managerId: 'user-3',
        memberIds: ['user-1', 'user-3', 'user-4'],
        tasks: [
            { id: 'WEB-1', summary: 'Draft Homepage Copy', status: 'To Do', priority: 'Medium', assigneeId: 'user-1', description: 'Need final text for the main landing page.' },
        ]
    }
];

// Helper to find a user by ID
const findUser = (id) => mockUsers.find(u => u.id === id);

// Helper to find a user by Email
const findUserByEmail = (email) => mockUsers.find(u => u.email === email);

// Helper to map assignee IDs to names for the frontend
const mapTasksWithAssignee = (projectTasks) => {
    return projectTasks.map(task => {
        const assignee = findUser(task.assigneeId);
        return { ...task, assigneeName: assignee ? assignee.name : 'Unassigned' };
    });
};

module.exports = {
    projects,
    mockUsers,
    statuses,
    findUser,
    findUserByEmail,
    mapTasksWithAssignee
};