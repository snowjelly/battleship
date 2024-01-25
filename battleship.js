const Ship = (length) => {
  let numTimesHit = 0;
  let sunk = false;

  function hit() {
    numTimesHit += 1;
    return { length, sunk, numTimesHit };
  }

  return { length, sunk, numTimesHit, hit };
};

export { Ship };
