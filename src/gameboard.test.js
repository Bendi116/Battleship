import Gameboard from "./gameboard.js";

const gb = Gameboard();
gb.createShip(2, [2, 2], "h");
gb.createShip(1, [3, 4], "h");
gb.createShip(1, [5, 5], "v");

test("Test create wrong ship", () => {
  expect(() => {
    gb.createShip(-1, [3, 4], "h");
  }).toThrow("Invalid ship size.");
  expect(() => {
    gb.createShip(1, [3, 4], "w");
  }).toThrow("Invalid ship alignment.");
  expect(() => {
    gb.createShip(1, [3], "v");
  }).toThrow("Coordinate size is wrong.");
  expect(() => {
    gb.createShip(10, [3, 4], "h");
  }).toThrow("Invalid ship placement.");
  expect(() => {
    gb.createShip(4, [9, 6], "h");
  }).toThrow("Invalid ship placement.");
  expect(() => {
    gb.createShip(1, [3, 4, 4], "v");
  }).toThrow("Coordinate size is wrong.");
});

test("Test Gameboard recieveAttack", () => {
  expect(gb.recieveAttack([1, 1])).toBe("noHit");
  expect(gb.recieveAttack([2, 2])).toBe("hit");
  expect(gb.recieveAttack([2, 2])).toBe("alreadyHit");
  expect(gb.recieveAttack([3, 2])).toBe("hit");
});
test("Test invalid arguments", () => {
  expect(() => {
    gb.recieveAttack([11, 3]);
  }).toThrow("Invalid gameboard coordinates.");
  expect(() => {
    gb.recieveAttack([-2, 3]);
  }).toThrow("Invalid gameboard coordinates.");
  expect(() => {
    gb.recieveAttack([10, 10]);
  }).toThrow("Invalid gameboard coordinates.");
  expect(() => {
    gb.recieveAttack([3, 5, 6]);
  }).toThrow("Coordinate size is wrong.");
  expect(() => {
    gb.recieveAttack([3]);
  }).toThrow("Coordinate size is wrong.");
});
test("Test allShipSunk", () => {
  expect(gb.allShipSunk()).toBe(false);
  expect(gb.recieveAttack([3, 4])).toBe("hit");
  expect(gb.recieveAttack([5, 5])).toBe("hit");
  expect(gb.allShipSunk()).toBe(true);
});

test("add ship twice", () => {
  {
    expect(() => {
      gb.createShip(3, [3, 0], "v");
    }).toThrow(
      "Coordinates already contains a ship or too close to an other ship.",
    );
    expect(() => {
      gb.createShip(1, [4, 4], "h");
    }).toThrow(
      "Coordinates already contains a ship or too close to an other ship.",
    );
  }
});
