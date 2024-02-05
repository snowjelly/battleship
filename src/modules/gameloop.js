import { Player, Gameboard, Ship } from "./battleship";

const Game = (player1Name, player2Name) => {
  const player1 = Player(player1Name, 1);
  const player2 = Player(player2Name, 2);
  player1.board.placeShipsRandomly();
  player2.board.placeShipsRandomly();

  console.log(player1.board.board);
  console.log(player2.board.board);

  return { player1, player2 };
};

export default Game;
