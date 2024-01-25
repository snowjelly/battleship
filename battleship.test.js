import { Gameboard, Ship } from "./battleship";

test("create a 2 length ship with full hp", () =>
  expect(Ship(2)).toMatchObject({
    length: 2,
    numTimesHit: 0,
  }));

test("hitting a ship", () => {
  const smallShip = Ship(2);
  expect(smallShip.hit()).toBe(1);
});

test("sinking a small ship", () => {
  const smallShip = Ship(2);
  smallShip.hit();
  smallShip.hit();
  expect(smallShip.isSunk()).toBe(true);
});

test("place a small ship at [0,0]", () => {
  const smallShip = Ship(2);
  expect(Gameboard().placeShip(smallShip, [0, 0])).toEqual({
    pos: [0, 0],
    ship: smallShip,
  });
});

test("missed attack at [3,3]", () => {
  const board = Gameboard();
  expect(board.receiveAttack([3, 3])).toBe(false);
});

test("attacked ship at [9,0]", () => {
  const board = Gameboard();
  const ship = Ship(6);
  board.placeShip(ship, [9, 0]);
  expect(board.receiveAttack([9, 0])).toMatchObject({ numTimesHit: 1 });
});

test("found all missed attacks i.e [0,0] [2,3] [3,5]", () => {
  const board = Gameboard();
  const ship = Ship(6);
  board.placeShip(ship, [9, 0]);
  board.receiveAttack([0, 0]);
  board.receiveAttack([2, 3]);
  board.receiveAttack([3, 5]);

  expect(board.missedAttacks()).toMatchObject([
    { pos: [0, 0] },
    { pos: [2, 3] },
    { pos: [3, 5] },
  ]);
});

test("all ships are sunk", () => {
  const board = Gameboard();
  const ship = Ship(1);
  board.placeShip(ship, [9, 0]);
  board.receiveAttack([9, 0]);
  expect(board.shipsSunk()).toBe(true);
});
