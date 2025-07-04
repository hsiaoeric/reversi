"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  createInitialBoard,
  getValidMoves,
  makeMove,
  checkGameOver,
  getWinner,
  calculateScores,
  getAiMove,
  PLAYER_1,
  PLAYER_2,
  AIStrategy,
  Board,
  Move,
  Player
} from "@/lib/reversi-logic";
import { generateAiOpponentName } from "@/ai/flows/generate-ai-opponent-name";

import GameBoard from "./game-board";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User, Bot } from "lucide-react";

type GameMode = "pvp" | "pva";

export default function GameClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const gameMode = useMemo(() => (searchParams.get("mode") as GameMode) || "pvp", [searchParams]);
  const aiStrategy = useMemo(() => (searchParams.get("strategy") as AIStrategy) || "Greedy", [searchParams]);

  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYER_1);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [scores, setScores] = useState({ player1: 2, player2: 2 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 0 | null>(null);
  const [flippedPieces, setFlippedPieces] = useState<Move[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiOpponentName, setAiOpponentName] = useState<string>('Computer');
  const [passMessage, setPassMessage] = useState<string | null>(null);

  const P1_NAME = "Player 1";
  const P2_NAME = gameMode === 'pva' ? aiOpponentName : "Player 2";

  const updateGameState = useCallback((currentBoard: Board, player: Player) => {
    const newScores = calculateScores(currentBoard);
    setScores(newScores);

    const newValidMoves = getValidMoves(currentBoard, player);
    setValidMoves(newValidMoves);

    const gameOver = checkGameOver(currentBoard);
    if (gameOver) {
      setIsGameOver(true);
      setWinner(getWinner(currentBoard));
    }
  }, []);

  useEffect(() => {
    updateGameState(board, currentPlayer);
  }, []);

  const handleMove = useCallback((row: number, col: number) => {
    if (isGameOver) return;
    const move = { row, col };
    
    const isMoveValid = validMoves.some(m => m.row === row && m.col === col);
    if (!isMoveValid) return;

    const { newBoard, flipped } = makeMove(board, move, currentPlayer);
    setBoard(newBoard);
    setFlippedPieces(flipped);
    setTimeout(() => setFlippedPieces([]), 800);
    
    const nextPlayer = currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    const newScores = calculateScores(newBoard);
    setScores(newScores);

    const nextPlayerMoves = getValidMoves(newBoard, nextPlayer);
    const currentPlayerMoves = getValidMoves(newBoard, currentPlayer);

    if (checkGameOver(newBoard)) {
        setIsGameOver(true);
        setWinner(getWinner(newBoard));
    } else if (nextPlayerMoves.length > 0) {
        setCurrentPlayer(nextPlayer);
        setValidMoves(nextPlayerMoves);
    } else {
        const nextPlayerName = nextPlayer === PLAYER_1 ? P1_NAME : P2_NAME;
        const currentPlayerName = currentPlayer === PLAYER_1 ? P1_NAME : P2_NAME;
        setPassMessage(`${nextPlayerName} has no valid moves. ${currentPlayerName}'s turn again.`);
        setTimeout(() => setPassMessage(null), 2000);
        setValidMoves(currentPlayerMoves);
    }
  }, [board, currentPlayer, isGameOver, validMoves, P1_NAME, P2_NAME]);

  useEffect(() => {
    if (gameMode === 'pva' && currentPlayer === PLAYER_2 && !isGameOver) {
      setIsAiThinking(true);
      if (aiOpponentName === 'Computer') {
        generateAiOpponentName({ aiStrategy }).then(res => setAiOpponentName(res.aiOpponentName)).catch(() => setAiOpponentName(aiStrategy));
      }

      const aiMoveTimeout = setTimeout(() => {
        const aiMove = getAiMove(board, PLAYER_2, aiStrategy);
        if (aiMove) {
          handleMove(aiMove.row, aiMove.col);
        }
        setIsAiThinking(false);
      }, 1000);

      return () => clearTimeout(aiMoveTimeout);
    }
  }, [gameMode, currentPlayer, isGameOver, board, aiStrategy, handleMove, aiOpponentName]);

  const resetGame = () => {
    const initialBoard = createInitialBoard();
    setBoard(initialBoard);
    setCurrentPlayer(PLAYER_1);
    updateGameState(initialBoard, PLAYER_1);
    setIsGameOver(false);
    setWinner(null);
  };
  
  const getPlayerName = (player: Player) => player === PLAYER_1 ? P1_NAME : P2_NAME;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
      {passMessage && (
        <div id="pass" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-green-700 rounded-2xl p-6 z-50 text-xl shadow-lg">
            {passMessage}
        </div>
      )}
      <div className="w-full max-w-[700px]">
        <div className="flex justify-between items-center mb-4 px-2">
            <h1 className="text-2xl sm:text-4xl font-bold font-headline">Watermelon Reversi</h1>
            <Button variant="outline" onClick={() => router.push('/')} className="text-black">New Game</Button>
        </div>
        
        <div className="flex justify-around items-center mb-4 p-4 rounded-lg">
            <div className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${currentPlayer === PLAYER_1 ? 'bg-green-500/20 scale-110' : ''}`}>
                <div className="flex items-center gap-2">
                    {gameMode === 'pva' ? <User className="w-6 h-6"/> : <div className="w-6 h-6 rounded-full bg-black border-2 border-gray-400" />}
                    <span className="text-lg font-semibold">{P1_NAME}</span>
                </div>
                <span className="text-3xl font-bold">{scores.player1}</span>
            </div>
            
            <div className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${currentPlayer === PLAYER_2 ? 'bg-green-500/20 scale-110' : ''}`}>
                <div className="flex items-center gap-2">
                    {gameMode === 'pva' ? <Bot className="w-6 h-6"/> : <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-400" />}
                    <span className="text-lg font-semibold">{P2_NAME}</span>
                </div>
                <span className="text-3xl font-bold">{scores.player2}</span>
            </div>
        </div>

        <GameBoard
          board={board}
          validMoves={validMoves}
          onSquareClick={handleMove}
          isAiThinking={isAiThinking}
          flippedPieces={flippedPieces}
        />

        <div id="message" className="text-center mt-4 text-lg font-medium">
            {isGameOver ? "Game Over" : `${getPlayerName(currentPlayer)}'s turn`}
        </div>

        <AlertDialog open={isGameOver}>
          <AlertDialogContent className="text-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Game Over!</AlertDialogTitle>
              <AlertDialogDescription>
                {winner === 0 ? "It's a tie!" : `${winner === PLAYER_1 ? P1_NAME : P2_NAME} wins!`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => router.push('/')}>Main Menu</Button>
              <AlertDialogAction onClick={resetGame}>Play Again</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
