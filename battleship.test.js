import { Ship } from "./battleship";

test("2 length ship with full hp", () =>
  expect(Ship(2)).toMatchObject({
    length: 2,
    sunk: false,
    numTimesHit: 0,
  }));
