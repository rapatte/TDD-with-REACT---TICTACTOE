import React, { useState } from 'react';
import './App.css'

export function calculateWinner(squares: (string | null)[]): string | null | any {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of winningLines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i: number): void => {
    const newBoard = [...board];
    if (calculateWinner(newBoard) || newBoard[i]) {
      return;
    }
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `GAGNANT : ${winner}`
    : board.every((square) => square) // Check for a draw
    ? 'ÉGALITÉ !'
    : `JOUEUR SUIVANT : ${xIsNext ? 'X' : 'O'}`;

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board">
        {board.map((square, i) => (
          <button key={i} className={`square ${square}`} data-testid={`square-${i}`} onClick={() => handleClick(i)}>
            {square}
          </button>
        ))}
      </div>
      <button onClick={() => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
      }}>REJOUER</button>
    </div>
  );
};

export default Game;
