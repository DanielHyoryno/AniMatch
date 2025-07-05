import { motion, useMotionValue, animate } from "framer-motion";
import History from "./History";
import BottomNextAnime from "./BottomNextAnime";
import { useEffect, useState } from "react";

interface BottomSheetProps {
  anime: { id: number; title: string; image: string };
  userId: string;
  refreshKey: number;
}

export default function BottomSheet({ anime, userId, refreshKey }: BottomSheetProps) {
  const previewHeight = 120;
  const sheetHeight = window.innerHeight;
  const closedY = sheetHeight - previewHeight;
  const openY = sheetHeight * 0.2;

  const y = useMotionValue(closedY);
  const [showHistory, setShowHistory] = useState(false);

  const handleDragEnd = (_: any, info: any) => {
    const halfway = (closedY + openY) / 2;
    if (info.point.y < halfway) {
      animate(y, openY, { type: "spring", stiffness: 300, damping: 30 });
    } else {
      animate(y, closedY, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  useEffect(() => {
    animate(y, closedY, { type: "spring", stiffness: 300, damping: 30 });
  }, []);

  useEffect(() => {
    const unsubscribe = y.on("change", (latestY) => {
      setShowHistory(latestY < sheetHeight / 1.5);
    });
    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full h-screen bg-black shadow-inner rounded-t-2xl z-20 overflow-hidden border-t-4 border-neon-blue"
      style={{ y }}
      drag="y"
      dragConstraints={{ top: openY, bottom: closedY }}
      onDragEnd={handleDragEnd}
    >
      <div className="relative flex justify-center p-2 cursor-grab active:cursor-grabbing">
        <div className="h-1 w-12 bg-neon-blue rounded"></div>
      </div>

      <div className="px-4 pb-2">
        <BottomNextAnime anime={anime} />
      </div>

      <motion.div
        className="max-h-[70vh] overflow-y-auto px-4 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: showHistory ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <History userId={userId} refreshKey={refreshKey} />
      </motion.div>
    </motion.div>
  );
}
