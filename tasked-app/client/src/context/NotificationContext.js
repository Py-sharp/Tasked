// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

// Hook for using the notification context
export const useNotification = () => useContext(NotificationContext);

// Notification Component (Toast)
const Notification = ({ message, type, id, onDismiss }) => {
    const style = {
        padding: '12px 20px',
        margin: '5px 0',
        borderRadius: '5px',
        color: 'white',
        backgroundColor: type === 'error' ? '#ff5630' : '#36b37e', // Red for error, Green for success
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 1,
        transition: 'opacity 0.5s ease-out',
        cursor: 'pointer'
    };

    return (
        <div style={style} onClick={() => onDismiss(id)}>
            <span>{message}</span>
            <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>&times;</span>
        </div>
    );
};

// Provider Component
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'success', duration = 5000) => {
        const id = Date.now();
        const newNotification = { id, message, type };

        // Add the new notification
        setNotifications(prev => [...prev, newNotification]);

        // Automatically dismiss after duration
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
    }, []);

    const dismissNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const styles = {
        container: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column-reverse', // Newest message on bottom
            gap: '10px',
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div style={styles.container}>
                {notifications.map(n => (
                    <Notification
                        key={n.id}
                        {...n}
                        onDismiss={dismissNotification}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
