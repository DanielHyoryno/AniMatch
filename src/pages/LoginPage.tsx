import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-cyan-400 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-neon-blue-glow flex flex-col md:flex-row items-center">

        {/* Left: Logo */}
        <div className="flex justify-center items-center w-full md:w-1/2 p-6">
          <img
            src={logo}
            alt="AniMatch Logo"
            className="w-57 md:w-69 object-contain animate-pulse"
          />
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-1/2 p-10 m-10">
          <h1 className="text-3xl font-bold text-center mb-6 drop-shadow-neon">
            Sign In
          </h1>

          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-neon-blue to-blue-600 text-white font-bold py-2 rounded shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-sm mt-2">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-neon-blue underline hover:text-white transition"
                onClick={() => navigate("/register")}
              >
                Register here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
