import { Player, Storage } from "./battleship";

const Game = (p1, p2) => {
  localStorage.setItem("turn", "p1");

  function next(e, styleResults) {
    if (
      localStorage.getItem("turn") === "p1" &&
      e.target.classList.contains("p2") &&
      !e.target.classList.contains("miss") &&
      !e.target.classList.contains("hit")
    ) {
      console.log(p2.board.shipsSunk());
      const coords = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
      styleResults(p1.attack(p2, coords), e);
      if (p2.board.shipsSunk().sunk) {
        localStorage.setItem("winner", p1.name);
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
      console.log(p1.board.shipsSunk());
      const coords = [Number(e.target.dataset.x), Number(e.target.dataset.y)];
      styleResults(p2.attack(p1, coords), e);
      if (p1.board.shipsSunk().sunk) {
        localStorage.setItem("winner", p2.name);
        return "gameover";
      }
      Storage().changeTurn();
    }
    return null;
  }

  return { next };
};

export default Game;
