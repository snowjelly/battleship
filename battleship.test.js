import { Ship } from "./battleship";

test("2 length ship with full hp", () =>
  expect(Ship()).toEqual({
    length: 2,
    sunk: false,
    hit: 0,
  }));
