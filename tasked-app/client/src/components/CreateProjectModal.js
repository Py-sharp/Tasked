import React, { useState } from 'react';
import { createProject, projectTypes } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const initialFormState = {
    name: '',
    key: '',
    type: projectTypes[0],
    managerId: '',
};

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated, availableUsers }) => {
    const [form, setForm] = useState(initialFormState);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const { showNotification } = useNotification();

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Auto-convert key to uppercase and ensure it has no spaces/special chars
        if (name === 'key') {
            newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 5); // Limit to 5 characters
        }

        setForm({ ...form, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.name || !form.key || !form.managerId) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsSaving(true);

        try {
            const result = await createProject(form);

            // SUCCESS NOTIFICATION: Confirming project creation
            showNotification(`Project '${result.data.name} (${result.data.key})' created successfully.`, 'success');

            setForm(initialFormState);
            onProjectCreated();
        } catch (err) {
            console.error("Failed to create project:", err);
            // ERROR NOTIFICATION
            showNotification(`Error: ${err.message || 'Key might already exist.'}`, 'error');
            setError(`Failed to create project: ${err.message || 'Unknown error'}. Key might already exist.`);
        } finally {
            setIsSaving(false);
        }
    };

    if (form.managerId === '' && availableUsers.length > 0) {
        setForm(prev => ({ ...prev, managerId: availableUsers[0].id }));
    }

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <form style={styles.modalContent} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3 style={styles.header}>Create New Project</h3>

                {error && <p style={styles.errorMessage}>{error}</p>}

                {/* Project Name */}
                <label style={styles.label}>Project Name *</label>
                <input
                    style={styles.input}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Marketing Website Redesign"
                    disabled={isSaving}
                />

                {/* Project Key */}
                <label style={styles.label}>Project Key (Short Identifier, max 5 chars) *</label>
                <input
                    style={styles.input}
                    name="key"
                    value={form.key}
                    onChange={handleChange}
                    required
                    placeholder="e.g., MWR"
                    maxLength={5}
                    disabled={isSaving}
                />

                {/* Project Type */}
                <label style={styles.label}>Project Type *</label>
                <select style={styles.input} name="type" value={form.type} onChange={handleChange} disabled={isSaving}>
                    {projectTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>

                {/* Project Manager */}
                <label style={styles.label}>Project Manager *</label>
                <select
                    style={styles.input}
                    name="managerId"
                    value={form.managerId}
                    onChange={handleChange}
                    required
                    disabled={isSaving}
                >
                    {availableUsers.length > 0 ? (
                        availableUsers.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email || user.role})
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>Loading users...</option>
                    )}
                </select>

                <div style={styles.buttonGroup}>
                    <button style={styles.cancelButton} type="button" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </button>
                    <button style={styles.submitButton} type="submit" disabled={isSaving}>
                        {isSaving ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(9,30,66,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '5px',
        width: '450px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    },
    header: {
        marginBottom: '20px',
        fontSize: '24px',
        color: '#172b4d',
        borderBottom: '1px solid #ebecf0',
        paddingBottom: '10px'
    },
    label: {
        display: 'block',
        margin: '10px 0 5px',
        fontWeight: 'bold',
        fontSize: '13px',
        color: '#5e6c84'
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '3px',
        boxSizing: 'border-box'
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px'
    },
    submitButton: {
        padding: '10px 15px',
        backgroundColor: '#0052cc',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'background-color 0.2s'
    },
    cancelButton: {
        padding: '10px 15px',
        backgroundColor: '#f4f5f7',
        color: '#172b4d',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    errorMessage: {
        color: '#ff5630',
        backgroundColor: '#ffeded',
        padding: '10px',
        borderRadius: '3px',
        marginBottom: '15px'
    }
};

export default CreateProjectModal;
