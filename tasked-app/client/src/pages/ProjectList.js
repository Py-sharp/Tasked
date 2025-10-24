import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, getAllUsers } from '../services/api';
import CreateProjectModal from '../components/CreateProjectModal'; // NEW IMPORT

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // NEW STATE for Modal

    const fetchData = useCallback(async () => {
        const [projResponse, userResponse] = await Promise.all([getProjects(), getAllUsers()]);
        setProjects(projResponse.data);
        setUsers(userResponse.data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getUserName = (id) => {
        const user = users.find(u => u.id === id);
        return user ? user.name : 'Unknown';
    };

    const handleProjectCreated = () => {
        // Close modal and refresh the list of projects
        setIsModalOpen(false);
        fetchData();
    };

    if (isLoading) return <div style={styles.loading}>Loading Projects...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.headerContainer}> {/* Use a new style for header */}
                <h1 style={styles.header}>All Projects</h1>
                {/* Updated Button to open the modal */}
                <button style={styles.createButton} onClick={() => setIsModalOpen(true)}>
                    + Create New Project
                </button>
            </header>

            <div style={styles.grid}>
                {projects.map(project => (
                    <Link to={`/project/${project.key}/board`} key={project.id} style={styles.card}>
                        <h3 style={styles.name}>{project.name} ({project.key})</h3>
                        <p style={styles.detail}>Type: {project.type}</p>
                        <p style={styles.detail}>Manager: {getUserName(project.managerId)}</p>
                        <p style={styles.detail}>Members: {project.memberIds.length}</p>
                    </Link>
                ))}
            </div>

            {/* NEW: Project Creation Modal */}
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={handleProjectCreated}
                availableUsers={users} // Pass the list of users for manager selection
            />
        </div>
    );
};

const styles = {
    container: { padding: '20px', backgroundColor: '#ebecf0', minHeight: '100vh' },
    headerContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    header: { color: '#172b4d', margin: 0 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: { display: 'block', backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 1px 0 rgba(9,30,66,.25)', textDecoration: 'none', color: '#172b4d', transition: 'transform 0.1s' },
    name: { margin: '0 0 5px 0', fontSize: '18px' },
    detail: { margin: '0', fontSize: '13px', color: '#5e6c84' },
    createButton: { padding: '8px 15px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' },
    loading: { padding: '50px', textAlign: 'center' }
};

export default ProjectList;
