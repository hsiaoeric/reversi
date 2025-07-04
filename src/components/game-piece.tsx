"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { EMPTY, Player } from "@/lib/reversi-logic";
import { SeedIcon } from "./icons/seed-icon";

interface GamePieceProps {
  player: 0 | Player;
  isFlipped: boolean;
}

export const GamePiece = memo(({ player, isFlipped }: GamePieceProps) => {
  if (player === EMPTY) {
    return null;
  }

  return (
    <div className="w-full h-full p-1 perspective">
      <div className={cn("relative w-full h-full preserve-3d", isFlipped && "animate-flip")}>
         <div className="absolute w-full h-full backface-hidden">
            <SeedIcon player={player === 1 ? 2 : 1} className="w-full h-full" />
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <SeedIcon player={player} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
});

GamePiece.displayName = 'GamePiece';
