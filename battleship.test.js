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

test("returns 10 by 10 board", () => {
  expect(Gameboard().generate().length).toBe(100);
});

test("Gameboard has an array of coordinates like [0,0] and [5,7]", () => {
  expect(Gameboard().generate()).toContainEqual([0, 0] && [5, 7]);
});

test("Gameboard within bounds", () => {
  expect(Gameboard().generate()).not.toContainEqual([10, 10]);
});
