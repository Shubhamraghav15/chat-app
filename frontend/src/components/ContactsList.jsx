// src/components/ContactsList.jsx
export default function ContactsList({ contacts, activeId, onSelect }) {
  
  return (
    <ul>
      {contacts.map(user => (
        <li
          key={user.id}
          onClick={() => onSelect(user)}
          className={
            `p-4 cursor-pointer hover:bg-gray-100 ` +
            (user.id === activeId ? 'bg-gray-200 font-semibold' : '')
          }
        >
          {user.username}
        </li>
      ))}
    </ul>
  );
}
