import { Player, Gameboard, Ship } from "./battleship";

const Game = (player1Name, player2Name) => {
  localStorage.removeItem("player1Board");
  localStorage.removeItem("player2Board");
  const player1 = Player(player1Name);
  const player2 = Player(player2Name);

  localStorage.setItem(
    "player1Board",
    JSON.stringify(player1.board.placeShipsRandomly())
  );
  localStorage.setItem(
    "player2Board",
    JSON.stringify(player2.board.placeShipsRandomly())
  );
};

export default Game;
