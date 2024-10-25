const Player = require("./player.js");
const player3 = Player("computer")
test("Test invalid player type", () => {
  expect(() => {
    const player = Player("plaeyr");
  }).toThrow("Invalid player type!");
  expect(() => {
    const player2 = Player("computr");
  }).toThrow("Invalid player type!");
});
