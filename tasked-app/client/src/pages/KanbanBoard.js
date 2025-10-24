// src/pages/KanbanBoard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import BoardColumn from '../components/BoardColumn';
import { getProjectDetails, updateTask } from '../services/api';

const KanbanBoard = ({ onOpenCreateModal }) => {
    const { projectKey } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [draggedTaskId, setDraggedTaskId] = useState(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getProjectDetails(projectKey.toUpperCase());
            if (response.data) {
                setProject(response.data);
                setTasks(response.data.tasks);
                setStatuses(response.statuses);
                setMembers(response.members);
            } else {
                setProject(null);
            }
        } catch (error) {
            console.error("Failed to fetch project details:", error);
        } finally {
            setIsLoading(false);
        }
    }, [projectKey]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Drag and Drop Logic (unchanged)
    const handleDragStart = (e, taskId) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const draggedTask = tasks.find(t => t.id === taskId);

        if (draggedTask && draggedTask.status !== newStatus) {
            const updatedTask = { ...draggedTask, status: newStatus };

            // Optimistic UI update
            setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));

            try {
                await updateTask(projectKey.toUpperCase(), taskId, { status: newStatus });
            } catch (error) {
                console.error("Failed to update task status:", error);
                // Revert on failure (simple re-fetch)
                fetchTasks();
            }
        }
    };

    const tasksByStatus = tasks.reduce((acc, task) => {
        acc[task.status] = acc[task.status] || [];
        acc[task.status].push(task);
        return acc;
    }, {});

    if (isLoading) return <div style={styles.loading}>Loading Board...</div>;
    if (!project) return <div style={styles.error}>Project **{projectKey}** not found.</div>;

    return (
        <div style={styles.boardView}>
            <header style={styles.header}>
                <h1 style={styles.projectTitle}>{project.name} Kanban Board</h1>
                <nav style={styles.nav}>
                    <Link to="/" style={styles.navLink}>Projects</Link>
                    <Link to={`/project/${projectKey}/settings`} style={styles.navLink}>Settings</Link>
                </nav>
                <button
                    style={styles.createButton}
                    onClick={() => onOpenCreateModal(project.key, members, fetchTasks)}
                >
                    + Create Task
                </button>
            </header>
            <div style={styles.boardContainer}>
                {statuses.map(status => (
                    <BoardColumn
                        key={status}
                        projectKey={projectKey}
                        status={status}
                        tasks={tasksByStatus[status] || []}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                ))}
            </div>
        </div>
    );
};

const styles = {
    boardView: {
        padding: '20px',
        backgroundColor: '#f4f5f7', // Light gray background
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '10px',
        borderBottom: '1px solid #dfe1e6'
    },
    projectTitle: {
        margin: 0,
        color: '#172b4d',
        fontSize: '24px'
    },
    nav: {
        marginRight: '20px',
        display: 'flex',
        gap: '15px'
    },
    navLink: {
        textDecoration: 'none',
        color: '#42526e',
        fontWeight: '500',
        transition: 'color 0.2s',
        padding: '5px',
    },
    boardContainer: {
        display: 'flex',
        overflowX: 'auto',
        paddingBottom: '10px',
        gap: '12px', // Spacing between columns
    },
    createButton: {
        padding: '10px 18px',
        backgroundColor: '#0052cc',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'background-color 0.2s',
    },
    loading: { padding: '50px', textAlign: 'center' },
    error: { padding: '50px', textAlign: 'center', color: 'red' }
};

export default KanbanBoard;