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
      <div id="chess-board" className="grid grid-cols-8 aspect-square shadow-2xl mx-auto w-full">
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
                  "aspect-square flex items-center justify-center bg-green-700 border border-black",
                  "transition-colors duration-300",
                  isValidMove ? "active bg-green-500 hover:bg-green-600 hover:shadow-inner cursor-pointer" : "hover:bg-green-800"
                )}
                onClick={() => isValidMove && onSquareClick(rowIndex, colIndex)}
              >
                <GamePiece player={cell} isFlipped={isFlipped} />
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
