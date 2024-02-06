import { Player, Gameboard, Ship, Storage } from "./battleship";

const Game = (player1Name, player2Name) => {
  const player1 = Player(player1Name, 1);
  const player2 = Player(player2Name, 2);
  player1.board.placeShipsRandomly();
  player2.board.placeShipsRandomly();

  console.log(player1.board.getBoard());
  console.log(player2.board.getBoard());

  localStorage.setItem("turn", "p1");

  function next(e, styleResults) {
    if (
      localStorage.getItem("turn") === "p1" &&
      e.target.classList.contains("p2") &&
      !e.target.classList.contains("miss") &&
      !e.target.classList.contains("hit")
    ) {
      const coords = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
      Storage().changeTurn();
      styleResults(player1.attack(player2, coords), e);
      if (player2.board.shipsSunk().sunk) {
        console.log(`${player1.name} wins!`);
      }
    }
    if (
      localStorage.getItem("turn") === "p2" &&
      !e.target.classList.contains("p2") &&
      !e.target.classList.contains("miss") &&
      !e.target.classList.contains("hit")
    ) {
      const coords = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
      Storage().changeTurn();
      styleResults(player2.attack(player1, coords), e);
      if (player1.board.shipsSunk().sunk) {
        console.log(`${player2.name} wins!`);
      }
    }
  }

  return { players: { player1, player2 }, next };
};

export default Game;
