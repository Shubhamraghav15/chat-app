// src/pages/Dashboard.jsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from '../api/axios';
import ContactsList from '../components/ContactsList';
import ChatWindow    from '../components/ChatWindow';

export default function Dashboard() {
  const { user, authTokens, logout } = useContext(AuthContext);
  const [contacts, setContacts]     = useState([]);
  const [activeContact, setActive]  = useState(null);
  const [messages, setMessages]     = useState([]);

  // 1️⃣ Fetch contacts on mount
  useEffect(() => {
  axios.get('chat/contacts/', {
  headers: { Authorization: `Bearer ${authTokens.access}` }
}).then(res => {
  const filtered = res.data.filter(contact => contact.id !== user.user_id); // use user_id or sub based on your token
  setContacts(filtered);
  // console.log('Contacts:', filtered);
  console.log("🚀 ~ useEffect ~ filtered:", filtered)
});
  }, [authTokens]);

  // 2️⃣ Fetch last 50 messages when activeContact changes
  useEffect(() => {
    if (!activeContact) return;
    axios.get(`chat/messages/${activeContact.id}/`, {
      headers: { Authorization: `Bearer ${authTokens.access}` }
    }).then(res => setMessages(res.data.reverse()));
  }, [activeContact, authTokens]);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-1/4 bg-white border-r overflow-y-auto">
        <header className="p-4 border-b flex justify-between">
          <h2 className="text-xl font-semibold">MyChat</h2>
          <button
            onClick={logout}
            className="text-red-600 hover:underline"
          >
            Log Out
          </button>
        </header>
        <ContactsList
          contacts={contacts}
          activeId={activeContact?.id}
          onSelect={setActive}
        />
      </aside>

      {/* Chat Window */}
      <main className="flex-1 flex flex-col">
        {activeContact
          ? <ChatWindow
              contact={activeContact}
              messages={messages}
              setMessages={setMessages}
            />
          : <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a contact to start chatting
            </div>
        }
      </main>
    </div>
  );
}
