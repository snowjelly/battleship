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

export { Ship };
