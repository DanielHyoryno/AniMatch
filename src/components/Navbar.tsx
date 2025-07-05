import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo3.png";

export default function Navbar({ user }: { user: any }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
    <motion.nav
        className="fixed top-0 w-full bg-black border-b-2 border-neon-blue flex items-center justify-between relative md:p-4 z-50 mb-10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer z-10" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="Logo"
            className="h-12 md:h-16 w-auto object-contain"
          />
        </div>

        {/* Center Nav - absolutely centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8">
          <button
            className="text-neon-blue font-semibold relative group"
            onClick={() => navigate("/")}
          >
            <span className="relative z-10">Home</span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-neon-blue transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </button>

          <button
            className="text-neon-blue font-semibold relative group"
            onClick={() => navigate("/recommendation")}
          >
            <span className="relative z-10">Recommendation</span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-neon-blue transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </button>
        </div>

        {/* Right Side: Welcome & Logout */}
        <div className="flex items-center space-x-3 z-10">
          <p className="hidden sm:block text-neon-blue text-sm md:text-base drop-shadow-neon-blue-glow truncate max-w-[120px] md:max-w-none mr-5">
            Welcome, {user?.email?.split("@")[0] || "User"}!
          </p>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-neon-blue to-blue-600 text-white font-bold py-1 md:py-2 px-3 md:px-4 rounded shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Logout
          </button>

          {/* Hamburger */}
          <div className="md:hidden z-50" onClick={toggleMenu}>
            <div className="space-y-1 cursor-pointer">
              <div className="w-6 h-1 bg-neon-blue"></div>
              <div className="w-6 h-1 bg-neon-blue"></div>
              <div className="w-6 h-1 bg-neon-blue"></div>
            </div>
          </div>
        </div>
      </motion.nav>


      {/* Mobile Side Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-95 flex flex-col justify-center items-center z-40 space-y-8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <button
              className="text-neon-blue text-2xl font-bold drop-shadow-neon-blue-glow"
              onClick={() => {
                navigate("/");
                setIsOpen(false);
              }}
            >
              Home
            </button>
            <button
              className="text-neon-blue text-2xl font-bold drop-shadow-neon-blue-glow"
              onClick={() => {
                navigate("/recommendation");
                setIsOpen(false);
              }}
            >
              Recommendation
            </button>
            <button
              onClick={async () => {
                await handleLogout();
                setIsOpen(false);
              }}
              className="bg-gradient-to-r from-neon-black to-blue-600 text-white text-2xl font-bold py-2 px-6 rounded shadow-md hover:scale-110 hover:shadow-xl transition-all duration-300"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
