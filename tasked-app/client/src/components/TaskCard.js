// src/components/TaskCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const TaskCard = ({ projectKey, task, onDragStart }) => {
    const priorityColor = {
        'High': '#ff5630', // Red
        'Medium': '#ffab00', // Orange
        'Low': '#36b37e' // Green
    };
    const assigneeName = task.assigneeName || 'Unassigned';

    return (
        <Link
            to={`/project/${projectKey}/board/${task.id}`}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            style={{
                ...styles.card,
                // Use priority color for the side border
                borderLeft: `4px solid ${priorityColor[task.priority]}`
            }}
        >
            <p style={styles.summary}>{task.summary}</p>
            <div style={styles.footer}>
                <span
                    style={{
                        ...styles.priorityChip,
                        backgroundColor: priorityColor[task.priority],
                        color: 'white', // White text for all chips
                    }}
                >
                    {task.priority}
                </span>
                <span style={styles.id}>{task.id}</span>
                <span style={styles.assignee}>
                    {/* Show initials or first letter of name */}
                    {assigneeName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </span>
            </div>
        </Link>
    );
};

const styles = {
    card: {
        padding: '12px',
        margin: '8px 0',
        backgroundColor: '#fff',
        borderRadius: '3px',
        boxShadow: '0 1px 0 rgba(9,30,66,.25)',
        cursor: 'pointer',
        textDecoration: 'none',
        color: '#172b4d',
        display: 'block',
        transition: 'background-color 0.1s',
    },
    summary: {
        margin: '0 0 8px 0',
        fontSize: '15px',
        fontWeight: '500',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        marginTop: '10px'
    },
    priorityChip: {
        padding: '3px 8px',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '10px'
    },
    id: {
        color: '#5e6c84',
        fontWeight: '600'
    },
    assignee: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#dfe1e6',
        color: '#172b4d',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '12px',
        marginLeft: 'auto', // Push to the right
    }
};

export default TaskCard;