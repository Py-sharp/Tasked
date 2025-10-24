// src/components/BoardColumn.js
import React from 'react';
import TaskCard from './TaskCard';

const BoardColumn = ({ projectKey, status, tasks, onDragStart, onDragOver, onDrop }) => {
    return (
        <div
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
            style={styles.column}
        >
            <h3 style={styles.header}>{status} ({tasks.length})</h3>
            <div style={styles.cardContainer}>
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        projectKey={projectKey}
                        task={task}
                        onDragStart={onDragStart}
                    />
                ))}
            </div>
        </div>
    );
};

const styles = {
    column: {
        minWidth: '300px', // Wider columns
        maxWidth: '300px',
        marginRight: '8px',
        backgroundColor: '#ebecf0', // Slightly lighter background for the column
        borderRadius: '4px', // Softer corners
        padding: '12px', // More padding
        flexShrink: 0,
        height: 'fit-content',
        boxShadow: '0 1px 3px rgba(9,30,66,.05)' // Subtle shadow
    },
    header: {
        fontSize: '14px',
        fontWeight: '600',
        padding: '4px 0',
        margin: '0 0 10px 0',
        color: '#5e6c84', // Less aggressive header color
        textTransform: 'uppercase'
    },
    cardContainer: {
        minHeight: '10px'
    }
};

export default BoardColumn;