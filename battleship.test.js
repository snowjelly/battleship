import { Ship } from "./battleship";

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
