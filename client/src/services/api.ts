import axios from "axios";

const API_URL = "http://localhost:3001";

export const api = {
  login: async (username: string) => {
    const response = await axios.post(`${API_URL}/users/login`, { username });
    return response.data;
  },

  getRooms: async () => {
    const response = await axios.get(`${API_URL}/rooms`);
    return response.data;
  },

  createRoom: async (name: string) => {
    const response = await axios.post(`${API_URL}/rooms`, { name });
    return response.data;
  },
};
