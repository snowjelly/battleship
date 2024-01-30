import { Gameboard, Ship, Player } from "./battleship";

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

test("place a ship of length 2 at [ [0,0],[0,1] ]", () => {
  const smallShip = Ship(2);
  const board = Gameboard();
  const coords = [];
  coords.push(board.placeShip(smallShip, [0, 0]));
  coords.push(board.placeShip(smallShip, [0, 1]));
  expect(coords).toEqual([
    { coords: [0, 0], ship: smallShip },
    { coords: [0, 1], ship: smallShip },
  ]);
});

test("missed attack at [3,3]", () => {
  const board = Gameboard();
  expect(board.receiveAttack([3, 3])).toBe(false);
});

test("attacked ship at [9,0]", () => {
  const board = Gameboard();
  const ship = Ship(6);
  board.placeShip(ship, [9, 0]);
  board.placeShip(ship, [9, 1]);
  board.placeShip(ship, [9, 2]);
  board.placeShip(ship, [9, 3]);
  board.placeShip(ship, [9, 4]);
  board.placeShip(ship, [9, 5]);
  board.receiveAttack([9, 2]);
  expect(board.receiveAttack([9, 0])).toMatchObject({ numTimesHit: 2 });
});

test("found all missed attacks i.e [0,0] [2,3] [3,5]", () => {
  const board = Gameboard();
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
  expect(board.shipsSunk().sunk).toBe(true);
});

test("placeship", () => {
  const board = Gameboard();
  const ship = Ship(3);
  board.placeShip(ship, [0, 0]);
  board.placeShip(ship, [0, 1]);
  board.placeShip(ship, [0, 2]);
  expect(board.shipsSunk().arrAlive).toEqual([
    { pos: [0, 0], ship },
    { pos: [0, 1], ship },
    { pos: [0, 2], ship },
  ]);
});

test("hit 3 length ship twice", () => {
  const board = Gameboard();
  const ship = Ship(3);
  board.placeShip(ship, [0, 0]);
  board.placeShip(ship, [0, 1]);
  board.placeShip(ship, [0, 2]);
  board.receiveAttack([0, 1]);
  board.receiveAttack([0, 0]);
  expect(board.shipsSunk().arrAlive).toMatchObject([
    {
      ship: { numTimesHit: 2 },
    },
    {
      ship: { numTimesHit: 2 },
    },
    {
      ship: { numTimesHit: 2 },
    },
  ]);
});

test("create invalid ship", () => {
  const board = Gameboard();
  const ship = Ship(3);

  expect(() =>
    board.placeShip(ship, [
      [0, 3],
      [0, 0],
      [0, 2],
    ])
  ).toThrow("Invalid placement");
});

test("player attacks enemy gameboard", () => {
  const player = Player("The entire Tekken 8 cast");
  const enemy = Player("Sol Badguy");
  expect(player.attack(enemy, [0, 0])).toBe(`${player.name} has missed!`);
});

test("place a ship in a random coordinate", () => {
  const board = Gameboard();
  board.placeShipsRandomly();
  expect(board.shipsSunk().sunk).toBe(false);
});
