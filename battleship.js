const Ship = (length) => {
  const numTimesHit = 0;

  function hit() {
    this.numTimesHit += 1;
    return this.numTimesHit;
  }

  function isSunk() {
    if (this.numTimesHit === length) return true;
    return false;
  }

  return { length, isSunk, numTimesHit, hit };
};

const Gameboard = () => {
  function generate() {
    const game = [];
    for (let i = 0; i < 10; i += 1) {
      for (let k = 0; k < 10; k += 1) {
        game.push({ pos: [i, k] });
      }
    }
    return game;
  }

  const board = generate();

  function getBoardCoords(pos) {
    for (let i = 0; i < board.length; i += 1) {
      if (board[i].pos[0] === pos[0] && board[i].pos[1] === pos[1]) {
        return board[i];
      }
    }
    return null;
  }

  function placeShip(ship, pos) {
    const shipPlaced = getBoardCoords(pos);
    shipPlaced.ship = ship;
    return shipPlaced;
  }

  function receiveAttack(coords) {
    const boardPos = getBoardCoords(coords);
    if (boardPos.ship) {
      boardPos.ship.hit();
      console.log(boardPos.ship);
      return boardPos.ship;
    }
    boardPos.miss = true;
    return false;
  }

  return { placeShip, receiveAttack };
};

Gameboard();

export { Ship, Gameboard };
