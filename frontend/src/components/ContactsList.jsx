// // src/components/ContactsList.jsx
// export default function ContactsList({ contacts, activeId, onSelect }) {
  
//   return (
//     <ul>
//       {contacts.map(user => (
//         <li
//           key={user.id}
//           onClick={() => onSelect(user)}
//           className={
//             `p-4 cursor-pointer hover:bg-gray-100 ` +
//             (user.id === activeId ? 'bg-gray-200 font-semibold' : '')
//           }
//         >
//           {user.username}
//         </li>
//       ))}
//     </ul>
//   );
// }
import React, { useState } from 'react';
import { LogOut, Search, X, ChevronDown, ChevronUp, Plus, User } from 'lucide-react';

export default function ContactsList({ 
  contacts, 
  activeContact, 
  setActiveContact, 
  onClose,
  logout 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isContactsOpen, setIsContactsOpen] = useState(true);
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md">
      {/* Header */}
      <header className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">MyChat</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={logout}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Log out"
          >
            <LogOut size={20} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      </header>
      
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
          />
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
          />
        </div>
      </div>
      
      {/* Contacts section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <button
            onClick={() => setIsContactsOpen(!isContactsOpen)}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span>Contacts ({contacts.length})</span>
            {isContactsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isContactsOpen && (
            <div className="mt-2 space-y-1">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setActiveContact(contact);
                      onClose();
                    }}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                      activeContact?.id === contact.id 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="relative mr-3">
                      {/* <img 
                        src={contact.avatar} 
                        alt={contact.username} 
                        className="w-12 h-12 rounded-full object-cover"
                      /> */}
                      <div className='p-2  border-grey-500 rounded-full bg-gray-100'>
                      <User color='blue' />

                      <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800 ${
                        contact.status === 'online' ? 'bg-green-500' : 
                        contact.status === 'away'   ? 'bg-yellow-500' : 
                        'bg-gray-400'
                      }`}/>
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className={`font-medium ${
                        activeContact?.id === contact.id 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {contact.username}
                      </h3>
                      {/* <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {contact.status === 'online' 
                          ? 'Online' 
                          : `Last seen ${new Date(contact.lastSeen).toLocaleTimeString([], {
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}`
                        }
                      </p> */}
                    </div>
                  </button>
                ))
              ) : (
                <p className="py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  No contacts found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* New chat button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Plus size={20} className="mr-2" />
          <span>New Conversation</span>
        </button>
      </div>
    </aside>
  );
}
