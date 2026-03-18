# 💬 Real-Time Chat Application

A clean, simple and educational real-time chat application built with **NestJS**, **React + TypeScript**, **Prisma** and **Socket.IO**.

---

## ✨ Features

- Simple username-based registration / login
- Create and browse chat rooms (rooms)
- Send and receive messages in **real time**
- Message history per room
- Multiple users connected simultaneously
- Modern and responsive interface

---

## 🛠️ Tech Stack

### Backend

- **NestJS**
- **Socket.IO** (WebSocket)
- **Prisma ORM** + **SQLite**
- **TypeScript**

### Frontend

- **React 18** + **TypeScript**
- **Vite**
- **Socket.IO Client**
- **Axios**
- **Tailwind CSS** (optional)

---

## 📁 Project Structure

```sh
chat-app/
├── api/ # NestJS Backend
│ ├── src/
│ │ ├── chat/
│ │ ├── messages/
│ │ ├── prisma/
│ │ ├── rooms/
│ │ ├── users/
│ │ ├── app.module.ts
│ │ └── main.ts
│ └── prisma/schema.prisma
│
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── types/
│ │ ├── App.tsx
│ │ └── main.tsx
│ └── vite.config.ts
```

---

## 🚀 Installation & Running

### 1. Backend

```bash
cd backend

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Start development server (runs on port 3001)
npm run start:dev
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start frontend (usually runs on port 5173)
npm run dev
```

## 📌 How to Use

1. Open the frontend (http://localhost:5173)
2. Enter a username (minimum 3 characters)
3. Create a new room or join an existing one
4. Start chatting in real time!
5. Open a second browser tab (or incognito window) with another username to test multi-user functionality

## 🧪 Useful REST Endpoints (for testing)

- POST /users/login → { "username": "Baibs" }
- GET /rooms
- POST /rooms → { "name": "general" }

## 👨‍💻 Author

Built as an educational project by **nf4r4r4n** with guidance from a senior full-stack developer.

Thank you for checking out this project!
This is a solid foundation for learning NestJS, React, TypeScript, and real-time communication with WebSockets.
Feel free to fork, improve, or use it as a base for your own projects.
Happy coding! 💻
