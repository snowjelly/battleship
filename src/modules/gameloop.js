import { Player, Storage } from "./battleship";

const Game = (player1Name, player2Name) => {
  const player1 = Player(player1Name, 1);
  const player2 = Player(player2Name, 2);

  localStorage.setItem("turn", "p1");

  function next(e, styleResults) {
    if (
      localStorage.getItem("turn") === "p1" &&
      e.target.classList.contains("p2") &&
      !e.target.classList.contains("miss") &&
      !e.target.classList.contains("hit")
    ) {
      const coords = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
      styleResults(player1.attack(player2, coords), e);
      if (player2.board.shipsSunk().sunk) {
        localStorage.setItem("winner", player1.name);
        return "gameover";
      }
      Storage().changeTurn();
    }
    if (
      localStorage.getItem("turn") === "p2" &&
      !e.target.classList.contains("p2") &&
      !e.target.classList.contains("miss") &&
      !e.target.classList.contains("hit")
    ) {
      const coords = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
      styleResults(player2.attack(player1, coords), e);
      if (player1.board.shipsSunk().sunk) {
        localStorage.setItem("winner", player2.name);
        return "gameover";
      }
      Storage().changeTurn();
    }
    return null;
  }

  return { next };
};

export default Game;
