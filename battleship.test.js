import { Ship } from "./battleship";

test("create a 2 length ship with full hp", () =>
  expect(Ship(2)).toMatchObject({
    length: 2,
    sunk: false,
    numTimesHit: 0,
  }));

test("hitting a ship", () => {
  expect(Ship(2).hit()).toMatchObject({ numTimesHit: 1 });
});
