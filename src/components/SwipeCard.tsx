import { motion, useAnimation } from "framer-motion";

interface SwipeCardProps {
  anime: {
    id: number;
    title: string;
    synopsis: string;
    image: string;
  };
  genres: string[];
  onLike: () => void;
  onDislike: () => void;
  index: number;
  zIndex: number;
}

export default function SwipeCard({
  anime,
  genres,
  onLike,
  onDislike,
  index,
  zIndex,
}: SwipeCardProps) {
  const controls = useAnimation();

  return (
    <motion.div
      className="bg-gray-900 rounded-xl shadow-lg overflow-hidden max-w-md w-11/12 absolute border border-neon-blue"
      drag={index === 0 ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      whileDrag={{ rotate: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) {
          controls.start({
            x: "30vw",
            y: window.innerHeight * 0.2,
            rotate: 20,
            opacity: 0,
            transition: { duration: 0.3, ease: "easeOut" },
          }).then(onLike);
        } else if (info.offset.x < -100) {
          controls.start({
            x: "-30vw",
            y: window.innerHeight * 0.2,
            rotate: -20,
            opacity: 0,
            transition: { duration: 0.3, ease: "easeOut" },
          }).then(onDislike);
        }
      }}
      animate={controls}
      style={{
        zIndex,
        scale: 1 - index * 0.05,
        top: `${index * 4}px`,
      }}
    >
      <img
        src={anime.image}
        alt={anime.title}
        className="w-full h-64 object-cover border-b border-neon-blue"
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold text-neon-blue">{anime.title}</h2>
        <p className="text-gray-300 mt-2 text-sm">
          {anime.synopsis.length > 120
            ? anime.synopsis.slice(0, 120) + "..."
            : anime.synopsis}
        </p>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-neon-blue bg-opacity-20 text-neon-blue rounded-full text-xs"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
