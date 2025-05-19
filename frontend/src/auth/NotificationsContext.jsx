import { createContext, useState } from 'react';

export const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [unreadContacts, setUnreadContacts] = useState({});

  return (
    <NotificationsContext.Provider value={{ unreadContacts, setUnreadContacts }}>
      {children}
    </NotificationsContext.Provider>
  );
}
