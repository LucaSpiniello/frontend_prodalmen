import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([])
  let socket: WebSocket | null = null;

  useEffect(() => {

    // Establecer conexión WebSocket
    socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/`);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data.notification]);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>Notificaciones</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
