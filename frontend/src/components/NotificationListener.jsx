
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import { NotificationsContext } from "../auth/NotificationsContext";

export default function NotificationListener() {
  const { authTokens, user } = useContext(AuthContext);
  const { setUnreadContacts } = useContext(NotificationsContext);

  useEffect(() => {
    if (!authTokens?.access) return;

    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${authTokens.access}`);

    socket.onopen = () => console.log("Notifications WebSocket connected");
    socket.onclose = () => console.log("Notifications WebSocket disconnected");
    socket.onerror = (e) => console.error("Notification socket error:", e);

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      console.log("Notification received:", msg);

      if (msg.from_user_id) {
        setUnreadContacts(prev => ({
          ...prev,
          [msg.from_user_id]: true
        }));
      }
    };

    return () => socket.close();
  }, [authTokens]);

  return null; 
}
