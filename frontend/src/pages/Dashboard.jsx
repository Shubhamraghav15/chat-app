
import React, { useContext, useEffect, useState } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';
import axios from '../api/axios';
import ContactsList from '../components/ContactsList';   
import ChatWindow from '../components/ChatWindow';
import useMediaQuery from '../hooks/useMediaQuery';

export default function Dashboard() {
  const { user, authTokens, logout } = useContext(AuthContext);
  const [contacts, setContacts]     = useState([]);
  const [activeContact, setActive]  = useState(null);
  const [messages, setMessages]     = useState([]);
  const [darkMode, setDarkMode]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    axios
      .get('chat/contacts/', {
        headers: { Authorization: `Bearer ${authTokens.access}` }
      })
      .then(res => {
        const others = res.data.filter(c => c.id !== user.user_id);
        setContacts(others);
      })
      .catch(err => console.error('Failed fetching contacts:', err));
  }, [authTokens, user.user_id]);

  useEffect(() => {
    if (!activeContact) return;
    axios
      .get(`chat/messages/${activeContact.id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` }
      })
      .then(res => {
      })
      .catch(err => console.error('Failed fetching messages:', err));
  }, [activeContact, authTokens]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out">

      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-200"
        >
          <Menu size={20} />
        </button>
      )}

      <div
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transform transition-transform duration-300 ease-in-out
          fixed md:relative z-40 h-full md:w-80 lg:w-96 ${isMobile ? 'w-3/4' : ''}
        `}
      >
        <ContactsList
          contacts={contacts}
          activeContact={activeContact}
          setActiveContact={c => {
            setActive(c);
            isMobile && setSidebarOpen(false);
          }}
          logout={logout}
        />
      </div>

      <div className="flex-1 flex flex-col relative">
        <header className="h-16 px-4 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-30">
          {activeContact ? (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={activeContact.avatar}
                  alt={activeContact.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span
                  className={`
                    absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white
                    ${activeContact.status === 'online'
                      ? 'bg-green-500'
                      : activeContact.status === 'away'
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                    }
                  `}
                />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  {activeContact.username}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeContact.status === 'online'
                    ? 'Online'
                    : `Last seen ${new Date(activeContact.lastSeen).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}`
                  }
                </p>
              </div>
            </div>
          ) : (
            <h2 className="font-semibold text-gray-800 dark:text-white">
              Select a contact
            </h2>
          )}

          <button
            onClick={() => setDarkMode(dm => !dm)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {activeContact ? (
          <ChatWindow
            contact={activeContact}
            messages={messages}
            setMessages={setMessages}
            userId={user.user_id}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 p-6">
            <div className="max-w-md text-center p-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Welcome to MyChat
              </h3>
              <p className="mb-4">
                Select a contact from the ContactsList to start chatting
              </p>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Open Contacts
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
