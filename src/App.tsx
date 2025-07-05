import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "./supabaseClient";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Recommendation from "./pages/Recommendation";
import type { Session } from "@supabase/supabase-js";
import AnimeDetail from "./pages/AnimeDetails";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  images: { jpg: { image_url: string } };
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [genresMap, setGenresMap] = useState<Record<number, string[]>>({});
  const [isPromotingNext, setIsPromotingNext] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedAnimeIds, setLoadedAnimeIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/top/anime?page=${currentPage}`);
        let newAnime: Anime[] = res.data.data;

        if (newAnime.length === 0) {
          console.log("No more anime available, stopping fetch.");
          return;
        }

        let swipedIds: Set<number> = new Set();
        if (session?.user) {
          const { data: swipes, error } = await supabase
            .from("swipes")
            .select("anime_id")
            .eq("user_id", session.user.id);

          if (error) console.error("Failed to fetch swipes:", error);
          swipedIds = new Set((swipes || []).map(s => s.anime_id));
        }

        const filteredAnime = newAnime.filter(anime =>
          !swipedIds.has(anime.mal_id) && !loadedAnimeIds.has(anime.mal_id)
        );

        if (filteredAnime.length === 0) {
          console.log(`Page ${currentPage} has no new anime left. Loading next page...`);
          setCurrentPage(prev => prev + 1);
          return;
        }

        setAnimeList(prev => [...prev, ...filteredAnime]);

        setLoadedAnimeIds(prev => {
          const updated = new Set(prev);
          filteredAnime.forEach(anime => updated.add(anime.mal_id));
          return updated;
        });

      } catch (err) {
        console.error(`Failed to fetch anime list on page ${currentPage}:`, err);
      }
    };

    if (session) {
      fetchAnime();
    }
  }, [currentPage, session, loadedAnimeIds]);

  useEffect(() => {
    const fetchGenres = async (animeId: number) => {
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`);
        setGenresMap(prev => ({
          ...prev,
          [animeId]: res.data.data.genres.map((g: any) => g.name),
        }));
      } catch (err) {
        console.error(`Failed to fetch genres for anime ID ${animeId}:`, err);
      }
    };

    if (animeList[currentIndex]) fetchGenres(animeList[currentIndex].mal_id);
    if (animeList[currentIndex + 1]) fetchGenres(animeList[currentIndex + 1].mal_id);
  }, [currentIndex, animeList]);

  useEffect(() => {
    if (isPromotingNext) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsPromotingNext(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isPromotingNext]);

  useEffect(() => {
    if (animeList.length - currentIndex < 5) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentIndex, animeList.length]);

  const handleSwipe = async (direction: "right" | "left") => {
    if (session?.user) {
      const anime = animeList[currentIndex];
      try {
        const animeDetails = await axios.get(`https://api.jikan.moe/v4/anime/${anime.mal_id}`);
        const data = animeDetails.data.data;

        await supabase.from("swipes").insert({
          user_id: session.user.id,
          anime_id: anime.mal_id,
          anime_title: anime.title,
          anime_image: anime.images.jpg.image_url,
          genres: data.genres.map((g: any) => g.name),
          themes: data.themes.map((t: any) => t.name),
          demographic: data.demographics[0]?.name || null,
          studio: data.studios[0]?.name || null,
          direction,
        });
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error("Failed to insert swipe with details:", error);
      }
    }
    setIsPromotingNext(true);
  };

  const handleLike = () => handleSwipe("right");
  const handleDislike = () => handleSwipe("left");

  const deckAnimes = [
    animeList[currentIndex + 1],
    animeList[currentIndex],
  ].filter(Boolean);

  const hasMoreAnime = currentIndex < animeList.length;
  const nextUpAnime = animeList[currentIndex + 1];

  return (
    <div className="min-h-screen flex flex-col relative bg-black px-4 sm:px-0">
      {session && <Navbar user={session.user} />}
      <main className="flex-1">
        <Routes>
          <Route
            path="/login"
            element={session ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={session ? <Navigate to="/" replace /> : <RegisterPage />}
          />

          {session ? (
            <>
              <Route
                path="/"
                element={
                  <Home
                    animeList={animeList}
                    currentIndex={currentIndex}
                    genresMap={genresMap}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    isPromotingNext={isPromotingNext}
                    // setCurrentIndex={setCurrentIndex}
                    // setIsPromotingNext={setIsPromotingNext}
                    nextUpAnime={nextUpAnime}
                    refreshKey={refreshKey}
                    session={session}
                    hasMoreAnime={hasMoreAnime}
                    // deckAnimes={deckAnimes}
                  />
                }
              />
              <Route
                path="/recommendation"
                element={<Recommendation userId={session.user.id} />}
              />
              <Route path="/anime/:id" element={<AnimeDetail />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </main>
    </div>
  );

}

export default App;
