import { Player, Gameboard, Ship } from "./battleship";

const Game = (player1Name, player2Name) => {
  localStorage.removeItem("player1Board");
  localStorage.removeItem("player1REAL");
  localStorage.removeItem("player2REAL");
  localStorage.removeItem("player2Board");
  const player1 = Player(player1Name);
  const player2 = Player(player2Name);
  player1.board.placeShipsRandomly();
  player2.board.placeShipsRandomly();

  console.log(player1.board.board);
  console.log(player2.board.board);

  localStorage.setItem("player1REAL", JSON.stringify(player1.board.board));

  localStorage.setItem("player2REAL", JSON.stringify(player2.board.board));
  return { player1, player2 };
};

export default Game;
