import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './pages/ProjectList';
import KanbanBoard from './pages/KanbanBoard';
import TaskDetail from './pages/TaskDetail';
import CreateTaskModal from './components/CreateTaskModal';
import ProjectSettings from './pages/ProjectSettings'; // 1. Import the actual component
import { NotificationProvider } from './context/NotificationContext'; // 2. Import the Notification Provider

function App() {
    const [modalState, setModalState] = useState({
        isOpen: false,
        projectKey: '',
        members: [],
        statuses: [],
        onTaskCreated: () => { }
    });

    const handleOpenCreateModal = (projectKey, members, fetchTasks) => {
        setModalState({
            isOpen: true,
            projectKey,
            members,
            statuses: ['To Do', 'In Progress', 'Done', 'Review', 'Blocked'],
            onTaskCreated: fetchTasks // Function to refresh the board after creation
        });
    };

    const handleCloseCreateModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    // 3. Wrap the whole app in the NotificationProvider
    return (
        <NotificationProvider>
            <Router>
                <Routes>
                    {/* 1. Project Selection Page (Home) */}
                    <Route path="/" element={<ProjectList />} />

                    {/* 2. Main Board View for a Specific Project */}
                    <Route
                        path="/project/:projectKey/board"
                        element={<KanbanBoard onOpenCreateModal={handleOpenCreateModal} />}
                    />

                    {/* 3. Project Settings/Members Page - NOW USING THE REAL COMPONENT */}
                    <Route
                        path="/project/:projectKey/settings"
                        element={<ProjectSettings />}
                    />
                </Routes>

                {/* Route to show the TaskDetail Modal/Page over the Board */}
                <Routes>
                    <Route path="/project/:projectKey/board/:taskId" element={<TaskDetail />} />
                </Routes>

                {/* Global Create Task Modal */}
                <CreateTaskModal
                    isOpen={modalState.isOpen}
                    onClose={handleCloseCreateModal}
                    onTaskCreated={modalState.onTaskCreated}
                    projectKey={modalState.projectKey}
                    projectMembers={modalState.members}
                    statuses={modalState.statuses}
                />
            </Router>
        </NotificationProvider>
    );
}

export default App;
