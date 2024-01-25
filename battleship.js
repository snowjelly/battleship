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
    for (let i = 0; i < 9; i += 1) {
      for (let k = 0; k < 9; k += 1) {
        game.push([i, k]);
      }
    }
    return game;
  }
  return { generate };
};

export { Ship, Gameboard };
