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

  function placeShip(ship, coords) {
    coords.reduce((prev, curr) => {
      console.log({ prev, curr });
      if (
        prev[0] - curr[0] > 1 ||
        prev[1] - curr[1] > 1 ||
        curr[1] - prev[1] > 1 ||
        curr[0] - prev[0] > 1
      )
        throw new Error("Invalid placement");
      else return curr;
    });
    coords.forEach((coord) => {
      const boardCoords = getBoardCoords(coord);
      boardCoords.ship = ship;
    });
    return { coords, ship };
  }

  function receiveAttack(coords) {
    const boardPos = getBoardCoords(coords);
    if (boardPos.ship) {
      boardPos.ship.hit();
      return boardPos.ship;
    }
    boardPos.miss = true;
    return false;
  }

  function missedAttacks() {
    const arr = [];
    for (let i = 0; i < board.length; i += 1) {
      if (board[i].miss) {
        arr.push(board[i]);
      }
    }
    return arr;
  }

  function shipsSunk() {
    const arrSunk = [];
    const arrAlive = [];
    for (let i = 0; i < board.length; i += 1) {
      if (board[i].ship) {
        if (board[i].ship.isSunk()) {
          arrSunk.push(board[i]);
        } else if (!board[i].ship.isSunk()) {
          arrAlive.push(board[i]);
        }
      }
    }
    if (arrAlive.length === 0) return { sunk: true, arrSunk };
    return { sunk: false, arrAlive };
  }

  return { placeShip, receiveAttack, missedAttacks, shipsSunk };
};

export { Ship, Gameboard };
