import { Player, Gameboard, Ship } from "./battleship";

const Game = (player1Name, player2Name = null) => {
  if (player2Name === null) {
    const player1 = Player(player1Name);
    player1.board.placeShipsRandomly();
    const ai = Player("AI");
    ai.board.placeShipsRandomly();

    return ai.attack(player1, player1.board.getRandomCoordinate().pos);
  }
};

export default Game;
