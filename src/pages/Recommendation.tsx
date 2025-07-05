import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

interface Swipe {
  anime_id: number;
  direction: string;
  genres: string[];
  themes: string[];
  studio: string | null;
  demographic: string | null;
}

interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  images: { jpg: { image_url: string } };
  genres: { name: string }[];
  themes: { name: string }[];
  studios: { name: string }[];
  demographics: { name: string }[];
}

export default function Recommendation({ userId }: { userId: string }) {
  const [recommendations, setRecommendations] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithRetry = async (url: string, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await axios.get(url);
      } catch (e) {
        console.warn(`Retry ${i + 1} for ${url}`);
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    throw new Error(`Failed to fetch ${url} after ${retries} retries`);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        const { data: swipes, error } = await supabase
          .from("swipes")
          .select("*")
          .eq("user_id", userId)
          .eq("direction", "right");

        if (error) {
          console.error("Failed to fetch swipes:", error);
          return;
        }

        if (!swipes || swipes.length === 0) {
          console.log("No liked swipes found");
          return;
        }

        const likedGenres = new Set<string>();
        const likedThemes = new Set<string>();
        const likedStudios = new Set<string>();
        const likedDemographics = new Set<string>();
        const swipedIds = new Set<number>();

        swipes.forEach((swipe: Swipe) => {
          swipe.genres.forEach((g) => likedGenres.add(g));
          swipe.themes.forEach((t) => likedThemes.add(t));
          if (swipe.studio) likedStudios.add(swipe.studio);
          if (swipe.demographic) likedDemographics.add(swipe.demographic);
          swipedIds.add(swipe.anime_id);
        });

        const candidateAnime: Anime[] = [];
        let page = 1;

        while (candidateAnime.length < 50 && page <= 50) {
          const res = await fetchWithRetry(`https://api.jikan.moe/v4/top/anime?page=${page}`);
          const pageAnime: Anime[] = res.data.data;

          for (const anime of pageAnime) {
            if (swipedIds.has(anime.mal_id)) continue;

            let score = 0;
            anime.genres.forEach((g) => likedGenres.has(g.name) && score++);
            anime.themes.forEach((t) => likedThemes.has(t.name) && score++);
            anime.studios.forEach((s) => likedStudios.has(s.name) && score++);
            anime.demographics.forEach((d) => likedDemographics.has(d.name) && score++);

            if (score > 0) {
              (anime as any).score = score;
              candidateAnime.push(anime);
            }
          }

          if (candidateAnime.length >= 50) break;
          page++;
          await new Promise((r) => setTimeout(r, 400));
        }

        setRecommendations(
          candidateAnime
            .sort((a, b) => (b as any).score - (a as any).score)
            .slice(0, 50)
        );
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) return (
    <div className="max-w-4xl mx-auto p-4 bg-black min-h-screen text-cyan-400">
      <h2 className="text-center mb-4 text-lg animate-pulse">Finding recommendations for you...</h2>
      <Spinner />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 animate-pulse">
        {[...Array(12)].map((_, idx) => (
          <div key={idx} className="bg-gray-800 rounded shadow h-64"></div>
        ))}
      </div>
    </div>
  );

  if (recommendations.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-4 bg-black min-h-screen flex flex-col justify-center items-center text-cyan-400">
        <h2 className="text-center text-lg">No recommendations found based on your likes 😢</h2>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-black min-h-screen text-cyan-400 mt-24">
      <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-neon">Recommended For You</h1>
      <div className="ml-8 mr-8 grid grid-cols-3 gap-7 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {recommendations.map((anime) => (
          <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`}>
            <div className="bg-gray-900 rounded shadow hover:scale-105 transition w-full max-w-[150px] sm:max-w-none mx-auto">
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="rounded-t w-full h-40 sm:h-48 object-cover border-b border-cyan-400"
              />
              <div className="p-2">
                <h3 className="font-semibold text-xs sm:text-sm truncate text-cyan-400">{anime.title}</h3>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  Genres: {anime.genres.map((g) => g.name).join(", ")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
