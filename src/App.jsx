import React, { useState } from 'react';
import style from './assets/css/Style.module.css'

// Komponen Square (perbaikan penulisan nama)
function Square({ value, onSquareClick }) {
  return (
    <button className={style.square} onClick={onSquareClick}>{value}</button>
  );
}

// Komponen Board
function Board({ xIsNext, squares, onPlay }) {
  // Fungsi handleClick untuk mengisi square dengan X atau O
  function handleClick(i) {
    // Tidak mengubah nilai square yang sudah diisi atau jika sudah ada pemenang
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // Mengisi square dengan X atau O
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';

    // Memanggil fungsi onPlay untuk mengubah state
    onPlay(newSquares);
  }

  // Menentukan status permainan
  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <>
      <div className={style.status}>{status}</div>
      <div className={style.board}>
        {squares.map((square, i) => (
          <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </>
  );
}

// Komponen Game (perbaikan penulisan nama dan penggunaan fungsi useState)
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(newSquares) {
    const newHistory = [...history.slice(0, currentMove + 1), newSquares];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move ${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button className={style.history} onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  function jumpTo(move) {
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  }

  return (
    <div className={style.game}>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className='gameInfo'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Fungsi calculateWinner untuk menentukan pemenang
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
