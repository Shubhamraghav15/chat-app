// src/components/ChatWindow.jsx
import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../auth/AuthContext';

export default function ChatWindow({ contact }) {
  const { user, authTokens } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('connecting…');
  const wsRef = useRef(null);setStatus
  const reconnectTimer = useRef(null);
  const queueRef = useRef([]);
  const myId = user.user_id;
const otherId = contact.id;
const roomName = `chat_${Math.min(myId, otherId)}_${Math.max(myId, otherId)}`;

console.log("🚀 ~ ChatWindow ~ roomName:", roomName)

  useEffect(() => {
    setMessages([]);
    axios
      .get(`chat/messages/${contact.id}/`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      })
      .then(res => {
        console.log("API Response:", res);
        console.log("Messages:", res.data);
        setMessages(res.data.reverse());
      })
      .catch(error => {
        console.error("Error fetching messages:", error);
      });
  }, [contact, authTokens]);

    console.log("🚀 ~ ChatWindow ~ res.data:", messages)

  useEffect(() => {
    const connect = () => {
      setStatus('connecting…');
      const socket = new WebSocket(
        `ws://localhost:8000/ws/chat/${contact.id}/?token=${authTokens.access}`
      );
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected');
        setStatus('open');
        queueRef.current.forEach(msg => socket.send(msg));
        queueRef.current = [];
      };
      socket.onmessage = e => {
  const msg = JSON.parse(e.data);
  const senderId = msg.sender_id ?? (msg.sender?.id ?? null);
  const receiverId = msg.receiver_id ?? (msg.receiver?.id ?? null);

    setMessages(prev => {
        if (msg.id && prev.some(m => m.id === msg.id)) return prev;

        const isDuplicate = prev.some(
          m =>
            m.isTemp &&
            m.text === msg.text &&
            m.sender_id === senderId &&
            Math.abs(new Date(m.timestamp) - new Date(msg.timestamp)) < 2000
        );
        if (isDuplicate) return prev;

        return [...prev, msg];
      });
    };





      socket.onclose = e => {
        console.warn('🔌 WebSocket closed', e);
        setStatus('closed');
        reconnectTimer.current = setTimeout(connect, 2000);
      };

      socket.onerror = e => {
        console.error('WebSocket error', e);
        socket.close();
      };

    };

    connect();

    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [contact, authTokens]);

  const bottomRef = useRef();
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

const sendMessage = useCallback(() => {
  const text = draft.trim();
  if (!text) return;

  const tempId = `temp-${Date.now()}`;
  const payload = { text, to: contact.id };

  const socket = wsRef.current;

  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));

    const tempMsg = {
      id: tempId,
      text,
      sender_id: user.user_id,
      receiver_id: contact.id,
      timestamp: new Date().toISOString(),
      isTemp: true,
    };

    setMessages(prev => [...prev, tempMsg]);
  } else {
    queueRef.current.push(JSON.stringify(payload));
  }

  setDraft('');
}, [draft, contact.id, user.user_id]);


  return (
    <div className="flex flex-col overflow-y-scroll [scrollbar-width:none] border-l">
      <div className="px-4 py-2 bg-gray-50 text-sm">
        Chat with <strong>{contact.username}</strong> —{' '}
        <span
          className={
            status === 'open'
              ? 'text-green-600'
              : status === 'connecting…'
              ? 'text-yellow-600'
              : 'text-red-600'
          }
        >
          {status}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 mb-[71px]">
        <div className="flex flex-col space-y-2">
          {messages.map((m, i) => {
            const senderId = m.sender_id ?? (typeof m.sender === 'object' ? m.sender.id : m.sender);
            const isOwnMessage = senderId === user.user_id;

            return (
              <div
                key={i}
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  isOwnMessage
                    ? 'bg-blue-100 self-end text-right'
                    : 'bg-white self-start text-left'
                }`}
              >
                <p className="break-words">{m.text}</p>
                <span className="block text-xs text-gray-400 mt-1">
                  {new Date(m.timestamp).toLocaleTimeString()}
                </span>
              </div>
            );
          })}
        </div>



        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t flex items-center space-x-2 absolute bottom-0 right-0 w-full">
        <input
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          placeholder="Type a message…"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 disabled:opacity-50"
          disabled={!draft.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}