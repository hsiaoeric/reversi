
export const BOARD_SIZE = 8;
export const PLAYER_1 = 1; // Human in PvA
export const PLAYER_2 = 2; // AI in PvA
export const EMPTY = 0;

export type Player = typeof PLAYER_1 | typeof PLAYER_2;
export type Cell = typeof EMPTY | Player;
export type Board = Cell[][];
export type Move = { row: number; col: number };
export type AIStrategy = "random" | "Max ev1" | "Max ev2" | "Max ev3" | "Min ev3";

const directions = [
  { r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 },
  { r: -1, c: -1 }, { r: -1, c: 1 }, { r: 1, c: -1 }, { r: 1, c: 1 },
];

export const createInitialBoard = (): Board => {
  const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
  const mid = BOARD_SIZE / 2;
  board[mid - 1][mid - 1] = PLAYER_1;
  board[mid][mid] = PLAYER_1;
  board[mid - 1][mid] = PLAYER_2;
  board[mid][mid - 1] = PLAYER_2;
  return board;
};

export const getFlips = (board: Board, row: number, col: number, player: Player): Move[] => {
  if (board[row][col] !== EMPTY) return [];

  const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
  const flips: Move[] = [];

  for (const dir of directions) {
    let r = row + dir.r;
    let c = col + dir.c;
    const lineFlips: Move[] = [];

    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
      if (board[r][c] === opponent) {
        lineFlips.push({ row: r, col: c });
        r += dir.r;
        c += dir.c;
      } else if (board[r][c] === player) {
        flips.push(...lineFlips);
        break;
      } else {
        break; // Empty square
      }
    }
  }
  return flips;
};

export const getValidMoves = (board: Board, player: Player): Move[] => {
  const moves: Move[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === EMPTY) {
        if (getFlips(board, r, c, player).length > 0) {
          moves.push({ row: r, col: c });
        }
      }
    }
  }
  return moves;
};

export const makeMove = (board: Board, move: Move, player: Player): { newBoard: Board; flipped: Move[] } => {
  const newBoard = board.map(row => [...row]);
  const flips = getFlips(newBoard, move.row, move.col, player);

  if (flips.length > 0) {
    newBoard[move.row][move.col] = player;
    for (const { row, col } of flips) {
      newBoard[row][col] = player;
    }
  }
  return { newBoard, flipped: [{...move}, ...flips] };
};

export const calculateScores = (board: Board): { player1: number, player2: number } => {
  let player1 = 0, player2 = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === PLAYER_1) player1++;
      else if (board[r][c] === PLAYER_2) player2++;
    }
  }
  return { player1, player2 };
};

export const checkGameOver = (board: Board): boolean => {
  const p1Moves = getValidMoves(board, PLAYER_1);
  const p2Moves = getValidMoves(board, PLAYER_2);
  return p1Moves.length === 0 && p2Moves.length === 0;
};

export const getWinner = (board: Board): Player | null | 0 => {
    const scores = calculateScores(board);
    if (scores.player1 > scores.player2) return PLAYER_1;
    if (scores.player2 > scores.player1) return PLAYER_2;
    return 0; // Tie
}

// --- AI LOGIC ---

// Strategy "random"
const getRandomMove = (validMoves: Move[]): Move | null => {
  if (validMoves.length === 0) return null;
  return validMoves[Math.floor(Math.random() * validMoves.length)];
};

// Strategy "Max ev2" (Greedy for flips)
const getGreedyMove = (board: Board, validMoves: Move[], player: Player): Move | null => {
  if (validMoves.length === 0) return null;
  
  let bestMove: Move | null = null;
  let maxFlips = -1;

  for (const move of validMoves) {
    const flips = getFlips(board, move.row, move.col, player).length;
    if (flips > maxFlips) {
      maxFlips = flips;
      bestMove = move;
    }
  }
  return bestMove;
};

// --- Strategic AI using Alpha-Beta Pruning ---
const STRATEGIC_DEPTH = 4; // Adjust for difficulty

// --- EVALUATION FUNCTIONS ---
const pieceSquareTable = [
    [120, -20, 20, 5, 5, 20, -20, 120],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [20, -5, 15, 3, 3, 15, -5, 20],
    [5, -5, 3, 3, 3, 3, -5, 5],
    [5, -5, 3, 3, 3, 3, -5, 5],
    [20, -5, 15, 3, 3, 15, -5, 20],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [120, -20, 20, 5, 5, 20, -20, 120]
];

// For "Max ev1" - Mobility-based evaluation
const evaluateMobility = (board: Board, player: Player): number => {
    const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    const playerMoves = getValidMoves(board, player).length;
    const opponentMoves = getValidMoves(board, opponent).length;
    return playerMoves - opponentMoves;
};

// For "Max ev3" - Combined evaluation
const evaluateCombined = (board: Board, player: Player): number => {
    const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    let positionalScore = 0;
    
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === player) {
                positionalScore += pieceSquareTable[r][c];
            } else if (board[r][c] === opponent) {
                positionalScore -= pieceSquareTable[r][c];
            }
        }
    }
    
    const mobilityScore = evaluateMobility(board, player);
    
    const scores = calculateScores(board);
    const pieceDifference = player === PLAYER_1 ? (scores.player1 - scores.player2) : (scores.player2 - scores.player1);
    
    if (checkGameOver(board)) {
        if (pieceDifference > 0) return 10000;
        if (pieceDifference < 0) return -10000;
        return 0;
    }
    
    // Combine heuristics with weights
    return positionalScore + (mobilityScore * 8) + (pieceDifference * 2);
};

// --- GENERIC ALPHA-BETA SEARCH ---
const alphaBeta = (board: Board, depth: number, alpha: number, beta: number, maximizingPlayer: boolean, player: Player, evaluate: (b: Board, p: Player) => number): number => {
    if (depth === 0 || checkGameOver(board)) {
        return evaluate(board, player);
    }

    const currentTurnPlayer = maximizingPlayer ? player : (player === PLAYER_1 ? PLAYER_2 : PLAYER_1);
    const moves = getValidMoves(board, currentTurnPlayer);

    if (moves.length === 0) {
      return alphaBeta(board, depth - 1, alpha, beta, !maximizingPlayer, player, evaluate);
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const { newBoard } = makeMove(board, move, currentTurnPlayer);
            const evalScore = alphaBeta(newBoard, depth - 1, alpha, beta, false, player, evaluate);
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            const { newBoard } = makeMove(board, move, currentTurnPlayer);
            const evalScore = alphaBeta(newBoard, depth - 1, alpha, beta, true, player, evaluate);
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

const findBestMove = (board: Board, validMoves: Move[], player: Player, evaluate: (b: Board, p: Player) => number, minimize = false): Move | null => {
    if (validMoves.length === 0) return null;
    
    let bestMove: Move | null = validMoves[0];
    let bestValue = minimize ? Infinity : -Infinity;

    for (const move of validMoves) {
        const { newBoard } = makeMove(board, move, player);
        const moveValue = alphaBeta(newBoard, STRATEGIC_DEPTH - 1, -Infinity, Infinity, false, player, evaluate);
        
        if (minimize ? (moveValue < bestValue) : (moveValue > bestValue)) {
            bestValue = moveValue;
            bestMove = move;
        }
    }
    return bestMove;
};

// --- Main AI Dispatcher ---
export const getAiMove = (board: Board, player: Player, strategy: AIStrategy): Move | null => {
    const validMoves = getValidMoves(board, player);
    if (validMoves.length === 0) return null;
    
    switch (strategy) {
        case "random":
            return getRandomMove(validMoves);
        case "Max ev2": // Greedy for flips
            return getGreedyMove(board, validMoves, player);
        case "Max ev1": // Mobility-based
            return findBestMove(board, validMoves, player, evaluateMobility);
        case "Max ev3": // Combined (strongest)
            return findBestMove(board, validMoves, player, evaluateCombined);
        case "Min ev3": // Sabotage (minimize combined score)
            return findBestMove(board, validMoves, player, evaluateCombined, true);
        default:
            return getRandomMove(validMoves);
    }
};
