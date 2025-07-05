import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Swipe {
  id: string;
  anime_id: number;
  anime_title: string;
  anime_image: string;
  direction: string;
  created_at: string;
}

export default function History({ userId, refreshKey }: { userId: string; refreshKey: number }) {
  const [swipes, setSwipes] = useState<Swipe[]>([]);

  useEffect(() => {
    const fetchSwipes = async () => {
      const { data, error } = await supabase
        .from("swipes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching swipes:", error);
      else setSwipes(data || []);
    };
    fetchSwipes();
  }, [userId, refreshKey]);

  const handleDelete = async (swipeId: string) => {
    const { error } = await supabase.from("swipes").delete().eq("id", swipeId);
    if (error) console.error("Failed to delete swipe:", error);
    else setSwipes((prev) => prev.filter((swipe) => swipe.id !== swipeId));
  };

  return (
    <div className="max-w-5xl w-full p-4 bg-black rounded shadow border-t-4 border-neon-blue mt-8">
      <h2 className="text-2xl font-bold mb-6 text-neon-blue drop-shadow">Your Swipe History</h2>

      {swipes.length === 0 ? (
        <p className="text-neon-pink">You haven't swiped anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Liked Swipes */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-neon-green">Liked</h3>
            {swipes.filter((s) => s.direction === "right").length === 0 ? (
              <p className="text-gray-400">No likes yet.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-4">
                {swipes.filter((s) => s.direction === "right").map((swipe) => (
                  <li key={swipe.id} className="relative rounded overflow-hidden shadow bg-gray-900 border border-neon-green">
                    <img
                      src={swipe.anime_image}
                      alt={swipe.anime_title}
                      className="w-full h-40 object-cover border-b border-neon-green"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 text-neon-green flex justify-between items-center">
                      <span className="font-semibold text-xs truncate">{swipe.anime_title}</span>
                      <button
                        className="bg-neon-pink hover:bg-pink-500 text-black font-bold text-xs px-2 py-1 rounded shadow transition"
                        onClick={() => handleDelete(swipe.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Disliked Swipes */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-neon-pink">Disliked</h3>
            {swipes.filter((s) => s.direction === "left").length === 0 ? (
              <p className="text-gray-400">No dislikes yet.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-4">
                {swipes.filter((s) => s.direction === "left").map((swipe) => (
                  <li key={swipe.id} className="relative rounded overflow-hidden shadow bg-gray-900 border border-neon-pink">
                    <img
                      src={swipe.anime_image}
                      alt={swipe.anime_title}
                      className="w-full h-40 object-cover border-b border-neon-pink"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 text-neon-pink flex justify-between items-center">
                      <span className="font-semibold text-xs truncate">{swipe.anime_title}</span>
                      <button
                        className="bg-neon-blue hover:bg-blue-500 text-black font-bold text-xs px-2 py-1 rounded shadow transition"
                        onClick={() => handleDelete(swipe.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );

}
