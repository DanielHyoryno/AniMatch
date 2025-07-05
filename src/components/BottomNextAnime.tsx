interface BottomNextAnimeProps {
  anime: {
    id: number;
    title: string;
    image: string;
  };
}

export default function BottomNextAnime({ anime }: BottomNextAnimeProps) {
  return (
    <div className="flex items-center space-x-4">
      <img
        src={anime.image}
        alt={anime.title}
        className="w-16 h-16 rounded-lg object-cover border border-neon-blue"
      />
      <div>
        <h3 className="text-lg font-semibold text-neon-blue">{anime.title}</h3>
        <p className="text-neon-white">Next up</p>
      </div>
    </div>
  );
}
