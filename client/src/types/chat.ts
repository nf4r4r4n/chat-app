export interface User {
  id: number;
  username: string;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: User;
  roomName?: string;
}

export interface Room {
  id: number;
  name: string;
  createdAt?: string;
}
