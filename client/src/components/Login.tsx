import React, { useState } from "react";
import { api } from "../services/api";

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.login(username.trim());

      if (response.success) onLoginSuccess(response.user.username);
      else
        setError(response.error || "Error has been occured while connecting");
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Impossible to connect to the server",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8">Real time Chat</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="username"
            >
              Choose your pseudo
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: Johnny"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              minLength={3}
              required
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold text-lg transition"
          >
            {loading ? "Connecting..." : "Join the chat"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          None need password • Unique pseudo
        </p>
      </div>
    </div>
  );
}
