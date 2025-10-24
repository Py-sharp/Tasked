import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectDetails, addProjectMember } from '../services/api';

const ProjectSettings = () => {
    const { projectKey } = useParams();
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const fetchProjectData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getProjectDetails(projectKey.toUpperCase());
            if (response.data) {
                setProject(response.data);
                setMembers(response.members);
            }
        } catch (error) {
            console.error("Failed to fetch project details:", error);
        } finally {
            setIsLoading(false);
        }
    }, [projectKey]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsAdding(true);
        setMessage('');

        try {
            const response = await addProjectMember(projectKey.toUpperCase(), email);
            setMessage(response.message);
            setEmail('');
            // Refresh the member list to show the newly added user
            fetchProjectData();

        } catch (error) {
            // Display the error message from the backend
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsAdding(false);
        }
    };

    if (isLoading) return <div style={styles.loading}>Loading Project Settings...</div>;
    if (!project) return <div style={styles.error}>Project **{projectKey}** not found.</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{project.name} Settings</h1>
                <Link to={`/project/${projectKey}/board`} style={styles.backButton}>
                    ← Back to Board
                </Link>
            </header>

            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Project Members ({members.length})</h2>
                <ul style={styles.memberList}>
                    {members.map(member => (
                        <li key={member.id} style={styles.memberItem}>
                            <span style={styles.memberIcon}>{member.name[0]}</span>
                            <div style={styles.memberDetails}>
                                <div style={styles.memberName}>{member.name}</div>
                                <div style={styles.memberRole}>{member.role} ({member.id})</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Invite New Member (Email Service Test)</h2>
                <form onSubmit={handleAddMember} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Enter user email (e.g., charlie@example.com)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                        disabled={isAdding}
                    />
                    <button type="submit" style={styles.submitButton} disabled={isAdding}>
                        {isAdding ? 'Adding...' : 'Add Member & Send Invite'}
                    </button>
                </form>
                {message && <p style={message.startsWith('Error') ? styles.errorMessage : styles.successMessage}>{message}</p>}
                <p style={styles.note}>Note: User must exist in the mock data for the project to find their ID and add them.</p>
            </section>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '10px',
        borderBottom: '2px solid #dfe1e6'
    },
    title: {
        margin: 0,
        fontSize: '32px',
        color: '#172b4d'
    },
    backButton: {
        textDecoration: 'none',
        color: '#0052cc',
        fontWeight: 'bold',
        padding: '8px 15px',
        borderRadius: '3px',
        transition: 'background-color 0.2s'
    },
    section: {
        marginBottom: '30px',
        padding: '20px',
        borderRadius: '5px',
        backgroundColor: '#f4f5f7'
    },
    sectionTitle: {
        fontSize: '20px',
        color: '#172b4d',
        marginBottom: '15px',
        borderBottom: '1px solid #dfe1e6',
        paddingBottom: '5px'
    },
    memberList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    memberItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #ebecf0',
    },
    memberIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#0052cc',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        marginRight: '15px',
        flexShrink: 0
    },
    memberName: {
        fontWeight: '600',
        color: '#172b4d',
    },
    memberRole: {
        fontSize: '12px',
        color: '#5e6c84',
    },
    form: {
        display: 'flex',
        gap: '10px',
        marginTop: '15px'
    },
    input: {
        flexGrow: 1,
        padding: '10px',
        borderRadius: '3px',
        border: '1px solid #ccc'
    },
    submitButton: {
        padding: '10px 15px',
        backgroundColor: '#0052cc',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        fontSize: '14px'
    },
    successMessage: {
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#e6ffed',
        border: '1px solid #36b37e',
        color: '#172b4d',
        borderRadius: '3px',
    },
    errorMessage: {
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#ffeded',
        border: '1px solid #ff5630',
        color: '#ff5630',
        borderRadius: '3px',
    },
    note: {
        fontSize: '12px',
        color: '#5e6c84',
        marginTop: '10px'
    },
    loading: { padding: '50px', textAlign: 'center' },
    error: { padding: '50px', textAlign: 'center', color: 'red' }
};

export default ProjectSettings;
