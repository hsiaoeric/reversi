"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { EMPTY, Player, PLAYER_1, PLAYER_2 } from "@/lib/reversi-logic";

interface GamePieceProps {
  player: 0 | Player;
  isFlipped: boolean;
}

export const GamePiece = memo(({ player, isFlipped }: GamePieceProps) => {
  if (player === EMPTY) {
    return null;
  }
  
  const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
  const pieceClass = player === PLAYER_1 ? "bg-black" : "bg-primary";

  if (!isFlipped) {
    return (
      <div className="chess w-[97%] h-[97%]">
        <div className={cn("w-full h-full rounded-full", pieceClass)} />
      </div>
    );
  }
  
  const opponentPieceClass = opponent === PLAYER_1 ? "bg-black" : "bg-primary";

  return (
    <div className="chess w-[97%] h-[97%] perspective">
      <div className="relative w-full h-full preserve-3d animate-flip-custom">
        <div className={cn("absolute w-full h-full rounded-full backface-hidden", opponentPieceClass)} />
        <div className={cn("absolute w-full h-full rounded-full backface-hidden rotate-y-180", pieceClass)} />
      </div>
    </div>
  );
});

GamePiece.displayName = 'GamePiece';
