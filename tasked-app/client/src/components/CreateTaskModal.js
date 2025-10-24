// src/components/CreateTaskModal.js
import React, { useState } from 'react';
import { createTask } from '../services/api';
import { useNotification } from '../context/NotificationContext'; // NEW: Import Notification Hook

const initialFormState = { summary: '', description: '', status: 'To Do', priority: 'Medium', assigneeId: '' };

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, projectKey, statuses, projectMembers }) => {
    const [form, setForm] = useState(initialFormState);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const { showNotification } = useNotification(); // NEW: Get showNotification function

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.summary) {
            setError('Task summary is required.');
            return;
        }

        setIsSaving(true);
        try {
            const response = await createTask(projectKey, form);

            // Notification logic: Find assignee name for feedback
            const assignee = projectMembers.find(m => m.id === response.data.assigneeId);
            const assigneeName = assignee ? assignee.name : 'Unassigned';

            showNotification(
                `Task '${response.data.summary}' created and assigned to ${assigneeName}.`,
                'success'
            );

            onTaskCreated(response.data);
            setForm(initialFormState);
            onClose();
        } catch (error) {
            console.error("Failed to create task:", error);
            const errorMessage = `Failed to create task: ${error.message || 'Unknown error'}`;
            setError(errorMessage);
            showNotification(errorMessage, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <form style={styles.modalContent} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                <h3 style={styles.header}>Create New Task in {projectKey}</h3>

                {error && <p style={styles.errorMessage}>{error}</p>}

                <label style={styles.label}>Summary *</label>
                <input
                    style={styles.input}
                    name="summary"
                    value={form.summary}
                    onChange={handleChange}
                    required
                    placeholder="What needs to be done?"
                    disabled={isSaving}
                />

                <label style={styles.label}>Description</label>
                <textarea
                    style={styles.textarea}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Details, acceptance criteria, and notes..."
                    disabled={isSaving}
                ></textarea>

                <label style={styles.label}>Assignee</label>
                <select
                    style={styles.input}
                    name="assigneeId"
                    value={form.assigneeId}
                    onChange={handleChange}
                    disabled={isSaving}
                >
                    <option value="">Unassigned</option>
                    {/* Display user name and email/role for clarity */}
                    {projectMembers.map(member => (
                        <option key={member.id} value={member.id}>
                            {member.name} ({member.email || member.role})
                        </option>
                    ))}
                </select>

                <label style={styles.label}>Status *</label>
                <select style={styles.input} name="status" value={form.status} onChange={handleChange} disabled={isSaving}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <label style={styles.label}>Priority</label>
                <select style={styles.input} name="priority" value={form.priority} onChange={handleChange} disabled={isSaving}>
                    {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <div style={styles.buttonGroup}>
                    <button style={styles.cancelButton} type="button" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </button>
                    <button style={styles.submitButton} type="submit" disabled={isSaving}>
                        {isSaving ? 'Creating...' : 'Create Task'}
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
        width: '600px',
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
    textarea: {
        width: '100%',
        height: '100px',
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '3px',
        boxSizing: 'border-box',
        resize: 'vertical'
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

export default CreateTaskModal;
