import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setMessage(error ? error.message : "Check your email for confirmation link!");
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setMessage(error ? error.message : "Logged in successfully!");
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-sm mx-auto my-4">
      <h2 className="text-xl font-bold mb-4">Sign Up / Login</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white w-full p-2 rounded mb-2"
        onClick={handleSignup}
        disabled={loading}
      >
        Sign Up
      </button>
      <button
        className="bg-green-500 text-white w-full p-2 rounded"
        onClick={handleLogin}
        disabled={loading}
      >
        Log In
      </button>
      {message && <p className="mt-2 text-center text-sm">{message}</p>}
    </div>
  );
}
