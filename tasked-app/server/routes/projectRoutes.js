// server/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
// Import the in-memory data and the new email service
const data = require('../data/mockData');
const { sendInvitation } = require('../services/emailService');

let { projects, mockUsers, statuses, findUser, findUserByEmail, mapTasksWithAssignee } = data;

// GET all projects
router.get('/projects', (req, res) => {
    // In a real app, you'd filter this by the logged-in user
    res.json({ data: projects });
});

// GET all users
router.get('/users', (req, res) => {
    res.json({ data: mockUsers });
});

// GET project details (including tasks, members, statuses)
router.get('/projects/:projectKey', (req, res) => {
    const projectKey = req.params.projectKey.toUpperCase();
    const project = projects.find(p => p.key === projectKey);

    if (project) {
        const members = project.memberIds.map(id => findUser(id)).filter(Boolean);
        const tasksWithAssignee = mapTasksWithAssignee(project.tasks);

        // We send back all mockUsers so the frontend can display task assignment options
        res.json({
            data: { ...project, tasks: tasksWithAssignee },
            members: members,
            statuses: statuses,
            allUsers: mockUsers
        });
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

// POST a new task
router.post('/projects/:projectKey/task', (req, res) => {
    const projectKey = req.params.projectKey.toUpperCase();
    const newTask = req.body;
    const projectIndex = projects.findIndex(p => p.key === projectKey);

    if (projectIndex !== -1) {
        const nextIdNumber = projects[projectIndex].tasks.length + 1;
        const nextId = `${projectKey}-${nextIdNumber}`;

        const taskWithId = {
            ...newTask,
            id: nextId.toUpperCase(),
            assigneeId: newTask.assigneeId || ''
        };
        projects[projectIndex].tasks.push(taskWithId);
        res.status(201).json({ status: 201, data: taskWithId });
    } else {
        res.status(404).json({ status: 404, error: 'Project not found' });
    }
});

// PUT/PATCH update a task (status, assignee, etc.)
router.patch('/projects/:projectKey/tasks/:taskId', (req, res) => {
    const { projectKey, taskId } = req.params;
    const updates = req.body;
    const projectIndex = projects.findIndex(p => p.key === projectKey.toUpperCase());

    if (projectIndex !== -1) {
        const taskIndex = projects[projectIndex].tasks.findIndex(t => t.id === taskId.toUpperCase());

        if (taskIndex !== -1) {
            projects[projectIndex].tasks[taskIndex] = {
                ...projects[projectIndex].tasks[taskIndex],
                ...updates,
            };
            res.json({ status: 200, data: projects[projectIndex].tasks[taskIndex] });
            return;
        }
    }
    res.status(404).json({ status: 404, error: 'Task or Project not found' });
});

// POST to add a new member to a project via email
router.post('/projects/:projectKey/members', async (req, res) => {
    const projectKey = req.params.projectKey.toUpperCase();
    const { email } = req.body;
    const project = projects.find(p => p.key === projectKey);
    // Find user in mock data by email (simulating finding an existing user)
    const user = findUserByEmail(email);

    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (!user) return res.status(404).json({ error: 'User with that email not found in mock data. Must use a mock email (e.g., alice@example.com).' });

    if (project.memberIds.includes(user.id)) {
        return res.status(409).json({ error: 'User is already a member' });
    }

    try {
        // 1. Add member to project (in-memory update)
        project.memberIds.push(user.id);

        // 2. Send invitation email
        await sendInvitation(email, project.name);

        res.json({
            message: `${user.name} added to project ${projectKey} and invitation email successfully sent to ${email}.`,
            memberId: user.id
        });
    } catch (error) {
        // Log the error but still confirm member addition for the in-memory store
        console.error('Email sending failed but member was added:', error.message);
        res.status(202).json({
            message: `${user.name} was added to project ${projectKey}, but there was an issue sending the email: ${error.message}`,
            memberId: user.id
        });
    }
});


module.exports = router;