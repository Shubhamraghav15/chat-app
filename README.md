# Real-Time Chat Application 🚀

A full-stack real-time chat app built with Django, Django Channels, React, Tailwind CSS, WebSockets, PostgreSQL, and Redis. This application allows users to exchange messages instantly, securely, and with a modern user interface.

---

## 🔧 Tech Stack

### Backend
- **Python** with **Django**
- **Django Channels** for WebSocket support
- **JWT Authentication** using `SimpleJWT`
- **Redis** as channel layer (via `channels_redis`)
- **PostgreSQL** for persistent storage

### Frontend
- **React** (Functional Components + Hooks)
- **Tailwind CSS** for styling
- **WebSocket API** for real-time message sync
- **Framer Motion** for animations
- **Responsive Design** with intuitive UX

---

## 📦 Features

- 🔐 JWT-based Login & Signup
- 📡 WebSocket powered real-time messaging
- 💬 Fetch last 50 messages on chat open
- 🎯 Per-user chat sessions (1-to-1)
- 🌐 Persistent login using access + refresh tokens
- ⚡ Auto-refresh access token to avoid session drops
- 🌈 Responsive UI built with Tailwind CSS
- ✨ Animated collapsible contact list
- 📥 Clean message history loading
- 🔁 Reconnect WebSocket on disconnect

---

## 🛠️ Local Setup Instructions

### 📁 1. Clone this repo

```bash
git clone https://github.com/Shubhamraghav15/chat-app.git
cd chat-app
