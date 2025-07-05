import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        setAnime(res.data.data);
      } catch (e) {
        console.error("Failed to fetch anime details", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [id]);

  if (loading) {
    return <div className="text-center text-white p-8 bg-black min-h-screen">Loading anime details...</div>;
  }

  if (!anime) {
    return <div className="text-center text-red-500 p-8 bg-black min-h-screen">Anime not found.</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="w-56 md:w-72 rounded shadow"
        />
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{anime.title}</h1>
          <div className="flex items-center text-yellow-400 text-sm space-x-4 mb-2">
            <span>⭐ {anime.score || "N/A"}</span>
            <span>{anime.year || "N/A"}</span>
            <span>{anime.duration || "N/A"}</span>
          </div>
          <p className="text-gray-300 mb-4">{anime.synopsis}</p>
          <p><span className="font-bold text-cyan-400">Type:</span> {anime.type}</p>
          <p><span className="font-bold text-cyan-400">Genres:</span> {anime.genres.map((g: any) => g.name).join(", ")}</p>
          <p><span className="font-bold text-cyan-400">Studios:</span> {anime.studios.map((s: any) => s.name).join(", ")}</p>
          <p><span className="font-bold text-cyan-400">Status:</span> {anime.status}</p>
        </div>
      </div>
    </div>
  );
}
