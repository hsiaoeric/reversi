
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

type PlayerType = "human" | "ai";

export default function GameClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const player1Type = useMemo(() => (searchParams.get("p1") as PlayerType) || "human", [searchParams]);
  const player2Type = useMemo(() => (searchParams.get("p2") as PlayerType) || "ai", [searchParams]);
  const player1Strategy = useMemo(() => (searchParams.get("p1strategy") as AIStrategy) || "Max ev2", [searchParams]);
  const player2Strategy = useMemo(() => (searchParams.get("p2strategy") as AIStrategy) || "Max ev2", [searchParams]);
  
  const [playerNames, setPlayerNames] = useState({ p1: 'Player 1', p2: 'Player 2' });
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYER_1);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [scores, setScores] = useState({ player1: 2, player2: 2 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 0 | null>(null);
  const [flippedPieces, setFlippedPieces] = useState<Move[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [passMessage, setPassMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchNames = async () => {
        let p1Name = "Player 1";
        let p2Name = "Player 2";
        if (player1Type === 'ai') {
            p1Name = (await generateAiOpponentName({ aiStrategy: player1Strategy })).aiOpponentName;
        }
        if (player2Type === 'ai') {
            p2Name = (await generateAiOpponentName({ aiStrategy: player2Strategy })).aiOpponentName;
        }
        setPlayerNames({ p1: p1Name, p2: p2Name });
    };
    fetchNames();
  }, [player1Type, player2Type, player1Strategy, player2Strategy]);

  useEffect(() => {
    setValidMoves(getValidMoves(board, currentPlayer));
  }, [board, currentPlayer]);


  const P1_NAME = playerNames.p1;
  const P2_NAME = playerNames.p2;
  const getPlayerName = (player: Player) => player === PLAYER_1 ? P1_NAME : P2_NAME;
  const getPlayerType = (player: Player): PlayerType => player === PLAYER_1 ? player1Type : player2Type;
  const getPlayerStrategy = (player: Player): AIStrategy => player === PLAYER_1 ? player1Strategy : player2Strategy;


  const handleMove = useCallback((row: number, col: number) => {
    if (isGameOver || getPlayerType(currentPlayer) === 'ai') return;
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
        setPassMessage(`${getPlayerName(nextPlayer)} has no valid moves. ${getPlayerName(currentPlayer)}'s turn again.`);
        setTimeout(() => setPassMessage(null), 2000);
        setValidMoves(currentPlayerMoves);
        // a player passes, so we don't switch player
    }
  }, [board, currentPlayer, isGameOver, validMoves, getPlayerName, player1Type, player2Type]);


  const makeAiMove = useCallback((currentBoard: Board, player: Player) => {
    const aiStrategy = getPlayerStrategy(player);
    const aiMove = getAiMove(currentBoard, player, aiStrategy);
    if (aiMove) {
        const { newBoard, flipped } = makeMove(currentBoard, aiMove, player);
        setBoard(newBoard);
        setFlippedPieces(flipped);
        setTimeout(() => setFlippedPieces([]), 800);
        
        const nextPlayer = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
        const newScores = calculateScores(newBoard);
        setScores(newScores);

        const nextPlayerMoves = getValidMoves(newBoard, nextPlayer);
        const currentPlayerMoves = getValidMoves(newBoard, player);

        if (checkGameOver(newBoard)) {
            setIsGameOver(true);
            setWinner(getWinner(newBoard));
        } else if (nextPlayerMoves.length > 0) {
            setCurrentPlayer(nextPlayer);
            setValidMoves(nextPlayerMoves);
        } else {
            setPassMessage(`${getPlayerName(nextPlayer)} has no valid moves. ${getPlayerName(player)}'s turn again.`);
            setTimeout(() => setPassMessage(null), 2000);
            setValidMoves(currentPlayerMoves);
            // Don't switch player, AI gets another turn
        }
    }
  }, [getPlayerStrategy, getPlayerName]);


  useEffect(() => {
    const currentPlayerType = getPlayerType(currentPlayer);
    if (currentPlayerType === 'ai' && !isGameOver) {
      setIsAiThinking(true);
      const boardCopy = JSON.parse(JSON.stringify(board));
      setTimeout(() => {
        makeAiMove(boardCopy, currentPlayer);
        setIsAiThinking(false);
      }, 1000); 
    }
  }, [currentPlayer, isGameOver, board, getPlayerType, makeAiMove]);

  const resetGame = () => {
    const initialBoard = createInitialBoard();
    setBoard(initialBoard);
    setCurrentPlayer(PLAYER_1);
    setValidMoves(getValidMoves(initialBoard, PLAYER_1));
    setScores(calculateScores(initialBoard));
    setIsGameOver(false);
    setWinner(null);
  };
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
      {passMessage && (
        <div id="pass" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-green-700 rounded-2xl p-6 z-50 text-xl shadow-lg">
            {passMessage}
        </div>
      )}
      <div className="w-full max-w-[700px]">
        <div className="flex justify-between items-center mb-4 px-2">
            <h1 className="text-2xl sm:text-4xl font-bold font-headline">Reversi</h1>
            <Button variant="outline" onClick={() => router.push('/')} className="text-black">New Game</Button>
        </div>
        
        <div className="flex justify-around items-center mb-4 p-4 rounded-lg">
            <div className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${currentPlayer === PLAYER_1 ? 'bg-pink-500/20 scale-110' : ''}`}>
                <div className="flex items-center gap-2">
                    {player1Type === 'ai' ? <Bot className="w-6 h-6"/> : <User className="w-6 h-6"/>}
                    <span className="text-lg font-semibold">{P1_NAME}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-black border-2 border-gray-400" />
                    <span className="text-3xl font-bold">{scores.player1}</span>
                 </div>
            </div>
            
            <div className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${currentPlayer === PLAYER_2 ? 'bg-pink-500/20 scale-110' : ''}`}>
                <div className="flex items-center gap-2">
                    {player2Type === 'ai' ? <Bot className="w-6 h-6"/> : <User className="w-6 h-6"/>}
                    <span className="text-lg font-semibold">{P2_NAME}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-pink-500 border-2 border-gray-400" />
                    <span className="text-3xl font-bold">{scores.player2}</span>
                </div>
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
            {isGameOver ? "Game Over" : isAiThinking ? `${getPlayerName(currentPlayer)} is thinking...` : `${getPlayerName(currentPlayer)}'s turn`}
        </div>

        <AlertDialog open={isGameOver}>
          <AlertDialogContent className="text-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Game Over!</AlertDialogTitle>
              <AlertDialogDescription>
                {winner === 0 ? "It's a tie!" : `${getPlayerName(winner as Player)} wins!`}
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
