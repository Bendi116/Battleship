import Ship from "./ship.js";

const ship = Ship(4);

test("Testing Ship Class functionality", () => {
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
