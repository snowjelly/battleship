const Ship = (length) => {
  let numTimesHit = 0;

  function hit() {
    numTimesHit += 1;
    return numTimesHit;
  }

  function isSunk() {
    if (numTimesHit === length) return true;
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

  function placeShip(ship, pos) {
    for (let i = 0; i < board.length; i += 1) {
      if (board[i].pos[0] === pos[0] && board[i].pos[1] === pos[1]) {
        board[i].ship = ship;
        return board[i];
      }
    }
    throw new Error("Out of bounds");
  }

  return { placeShip };
};

Gameboard();

export { Ship, Gameboard };
