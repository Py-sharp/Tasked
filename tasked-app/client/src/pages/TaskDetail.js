// src/pages/TaskDetail.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectDetails, updateTask } from '../services/api';

const TaskDetail = () => {
  const { projectKey, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const fetchTask = useCallback(async () => {
    try {
        const response = await getProjectDetails(projectKey.toUpperCase());
        if (response.data) {
            const foundTask = response.data.tasks.find(t => t.id === taskId);
            setTask(foundTask);
            setAvailableUsers(response.allUsers); // All users for assignment list
            setStatuses(response.statuses);
        }
    } catch (error) {
        console.error("Error fetching task details:", error);
    }
  }, [projectKey, taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleUpdate = async (fieldName, value) => {
    // Optimistic UI Update
    setTask(prev => ({ ...prev, [fieldName]: value }));

    // API Call to Update
    try {
        await updateTask(projectKey.toUpperCase(), taskId, { [fieldName]: value });
    } catch (error) {
        console.error(`Failed to update ${fieldName}:`, error);
        // On error, re-fetch to revert local state
        fetchTask();
    }
  };
  
  if (!task) return <div style={{padding: '50px'}}>Loading or Task **{taskId}** not found...</div>;

  const currentAssignee = availableUsers.find(u => u.id === task.assigneeId) || { name: 'Unassigned', id: '' };

  return (
    <div style={styles.modalOverlay} onClick={() => navigate(`/project/${projectKey}/board`)}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={() => navigate(`/project/${projectKey}/board`)}>&times;</button>
        <p style={styles.id}>{task.id}</p>
        <h2 style={styles.summary}>{task.summary}</h2>

        {/* ASSIGNEE FIELD */}
        <div style={styles.fieldRow}>
            <strong>Assignee:</strong>
            <select 
                value={task.assigneeId || ''} 
                onChange={(e) => handleUpdate('assigneeId', e.target.value)} 
                style={styles.select}
            >
                <option value="">Unassigned</option>
                {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
        </div>

        {/* STATUS FIELD */}
        <div style={styles.fieldRow}>
            <strong>Status:</strong>
            <select 
                value={task.status} 
                onChange={(e) => handleUpdate('status', e.target.value)} 
                style={styles.select}
            >
                {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
        </div>
        
        <div style={styles.descriptionBox}>
            <h3>Description</h3>
            <p>{task.description || "No description provided."}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '5px', width: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
    closeButton: { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
    id: { fontSize: '12px', fontWeight: 'bold', color: '#5e6c84' },
    summary: { marginTop: '5px', marginBottom: '20px' },
    descriptionBox: { border: '1px solid #ccc', padding: '15px', borderRadius: '4px', backgroundColor: '#f4f5f7', marginTop: '20px' },
    fieldRow: { display: 'flex', alignItems: 'center', marginBottom: '15px' },
    select: { marginLeft: '10px', padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }
};

export default TaskDetail;