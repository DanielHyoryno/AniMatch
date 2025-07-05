import SwipeCard from "../components/SwipeCard";
import BottomSheet from "../components/BottomSheet";

interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  images: { jpg: { image_url: string } };
}

interface HomeProps {
  animeList: Anime[];
  currentIndex: number;
  genresMap: Record<number, string[]>;
  onLike: () => void;
  onDislike: () => void;
  isPromotingNext: boolean;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsPromotingNext: React.Dispatch<React.SetStateAction<boolean>>;
  nextUpAnime?: Anime | null;
  refreshKey: number;
  session: any; // replace with Supabase Session type if you want stricter typing
}

export default function Home({
  animeList,
  currentIndex,
  genresMap,
  onLike,
  onDislike,
  isPromotingNext,
  setCurrentIndex,
  setIsPromotingNext,
  nextUpAnime,
  refreshKey,
  session,
}: HomeProps) {
  const deckAnimes = [
    animeList[currentIndex + 1],
    animeList[currentIndex],
  ].filter(Boolean);

  const hasMoreAnime = currentIndex < animeList.length;

  return (
    <div className="relative overflow-hidden min-h-screen flex justify-center items-center bg-black mb-100">
      {animeList.length === 0 && (
        <h2 className="text-2xl text-neon-blue text-center p-4 animate-pulse">
          Loading anime list...
        </h2>
      )}

      <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center">
        {deckAnimes.length > 0 ? (
          [...deckAnimes]
            .reverse()
            .map((anime, i) => {
              if (!anime || !anime.mal_id) return null; // 🛡️ safety check

              const isCurrent = i === 0;
              const correctedIndex = isCurrent ? 0 : 1;
              const zIndex = isPromotingNext ? (isCurrent ? 0 : 10) : (10 - correctedIndex);

              return (
                <SwipeCard
                  key={anime.mal_id}
                  anime={{
                    id: anime.mal_id,
                    title: anime.title,
                    synopsis: anime.synopsis,
                    image: anime.images.jpg.image_url,
                  }}
                  genres={genresMap[anime.mal_id] || []}
                  onLike={onLike}
                  onDislike={onDislike}
                  index={correctedIndex}
                  zIndex={zIndex}
                />
              );
            })
        ) : (
          animeList.length > 0 && (
            <h2 className="text-2xl text-neon-pink text-center p-4 animate-pulse">
              No more cards to display.
            </h2>
          )
        )}
      </div>

      {!hasMoreAnime && animeList.length > 0 && (
        <h2 className="text-2xl text-neon-blue text-center p-4 animate-pulse">
          You’ve reached the end of the list!
        </h2>
      )}

      {nextUpAnime && session && (
        <BottomSheet
          anime={{
            id: nextUpAnime.mal_id,
            title: nextUpAnime.title,
            image: nextUpAnime.images.jpg.image_url,
          }}
          userId={session.user.id}
          refreshKey={refreshKey}
        />
      )}
    </div>
  );
}
