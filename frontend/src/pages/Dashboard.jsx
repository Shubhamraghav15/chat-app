// // src/pages/Dashboard.jsx
// import { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../auth/AuthContext';
// import axios from '../api/axios';
// import ContactsList from '../components/ContactsList';
// import ChatWindow    from '../components/ChatWindow';

// export default function Dashboard() {
//   const { user, authTokens, logout } = useContext(AuthContext);
//   const [contacts, setContacts]     = useState([]);
//   const [activeContact, setActive]  = useState(null);
//   const [messages, setMessages]     = useState([]);

//   // 1️⃣ Fetch contacts on mount
//   useEffect(() => {
//   axios.get('chat/contacts/', {
//   headers: { Authorization: `Bearer ${authTokens.access}` }
// }).then(res => {
//   const filtered = res.data.filter(contact => contact.id !== user.user_id); // use user_id or sub based on your token
//   setContacts(filtered);
//   // console.log('Contacts:', filtered);
//   console.log("🚀 ~ useEffect ~ filtered:", filtered)
// });
//   }, [authTokens]);

//   // 2️⃣ Fetch last 50 messages when activeContact changes
//   useEffect(() => {
//     if (!activeContact) return;
//     axios.get(`chat/messages/${activeContact.id}/`, {
//       headers: { Authorization: `Bearer ${authTokens.access}` }
//     }).then(res => setMessages(res.data.reverse()));
//   }, [activeContact, authTokens]);

//   return (
//     <div className="flex h-screen">
//       {/* Left ContactsList */}
//       <aside className="w-1/4 bg-white border-r overflow-y-auto">
//         <header className="p-4 border-b flex justify-between">
//           <h2 className="text-xl font-semibold">MyChat</h2>
//           <button
//             onClick={logout}
//             className="text-red-600 hover:underline"
//           >
//             Log Out
//           </button>
//         </header>
//         <ContactsList
//           contacts={contacts}
//           activeId={activeContact?.id}
//           onSelect={setActive}
//         />
//       </aside>

//       {/* Chat Window */}
//       <main className="flex-1 flex flex-col">
//         {activeContact
//           ? <ChatWindow
//               contact={activeContact}
//               messages={messages}
//               setMessages={setMessages}
//             />
//           : <div className="flex-1 flex items-center justify-center text-gray-500">
//               Select a contact to start chatting
//             </div>
//         }
//       </main>
//     </div>
//   );
// }

import React, { useContext, useEffect, useState } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';
import axios from '../api/axios';
import ContactsList from '../components/ContactsList';      // or your ContactsList wrapped in ContactsList
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

  // auto‐close ContactsList on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // dark mode toggling class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // 1️⃣ Fetch contacts on mount
  useEffect(() => {
    axios
      .get('chat/contacts/', {
        headers: { Authorization: `Bearer ${authTokens.access}` }
      })
      .then(res => {
        // filter out yourself
        const others = res.data.filter(c => c.id !== user.user_id);
        setContacts(others);
      })
      .catch(err => console.error('Failed fetching contacts:', err));
  }, [authTokens, user.user_id]);

  // 2️⃣ Fetch last 50 messages when activeContact changes
  useEffect(() => {
    if (!activeContact) return;
    axios
      .get(`chat/messages/${activeContact.id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` }
      })
      .then(res => {
        // API returns newest first? reverse to chronological
        setMessages(Array.isArray(res.data) ? res.data.reverse() : []);
      })
      .catch(err => console.error('Failed fetching messages:', err));
  }, [activeContact, authTokens]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out">

      {/* Mobile ContactsList toggle button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-200"
        >
          <Menu size={20} />
        </button>
      )}

      {/* ContactsList */}
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

      {/* Chat area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
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

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(dm => !dm)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* ChatWindow or placeholder */}
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

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
