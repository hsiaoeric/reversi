"use client";

import { memo } from "react";
import type { Board, Move } from "@/lib/reversi-logic";
import { GamePiece } from "./game-piece";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface GameBoardProps {
  board: Board;
  validMoves: Move[];
  onSquareClick: (row: number, col: number) => void;
  isAiThinking: boolean;
  flippedPieces: Move[];
}

const GameBoard = ({ board, validMoves, onSquareClick, isAiThinking, flippedPieces }: GameBoardProps) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-8 aspect-square bg-green-800/50 rounded-lg shadow-2xl p-2 gap-1 border-4 border-secondary">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isValidMove = validMoves.some(
              (m) => m.row === rowIndex && m.col === colIndex
            );
            const isFlipped = flippedPieces.some(
                (p) => p.row === rowIndex && p.col === colIndex
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square rounded-md flex items-center justify-center",
                  (rowIndex + colIndex) % 2 === 0 ? "bg-secondary/70" : "bg-secondary/50",
                  "hover:bg-primary/30 transition-colors duration-200",
                  isValidMove && "cursor-pointer"
                )}
                onClick={() => onSquareClick(rowIndex, colIndex)}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <GamePiece player={cell} isFlipped={isFlipped} />
                  {isValidMove && (
                    <div className="absolute w-1/4 h-1/4 rounded-full bg-primary/50" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      {isAiThinking && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <Loader className="w-16 h-16 animate-spin text-primary-foreground"/>
        </div>
      )}
    </div>
  );
};

export default memo(GameBoard);
