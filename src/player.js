import Gameboard from "./gameboard";

export default function Player(type) {
  //costructor
  const gameboard = Gameboard();
  if (type == "player") {
  } else if (type == "computer") {
    generateRandomGameBoard();
  } else {
    throw new Error("Invalid player type!");
  }

  function generateRandomGameBoard() {
    for (let i = 0; i < 4; ++i) {
      let counter = 0;
      while (counter < 4 - i) {
        try {
          let x = Math.floor(Math.random() * 10);
          let y = Math.floor(Math.random() * 10);
          if (Math.round(Math.random()) == 1) {
            gameboard.createShip(i + 1, [x, y], "v");
          } else {
            gameboard.createShip(i + 1, [x, y], "h");
          }
          counter++;
        } catch (err) {
          continue;
        }
      }
    }
  }

  function randomHit(hitCoords, adjacentHitCoords, setAdjacentHitCoords) {
    if (adjacentHitCoords.length > 0) {
      let ind = Math.floor(Math.random() * adjacentHitCoords.length);
      let coord = adjacentHitCoords[ind];
      console.log("first ", adjacentHitCoords);

      adjacentHitCoords = adjacentHitCoords
        .slice(0, ind)
        .concat(adjacentHitCoords.slice(ind + 1));
      console.log("after concat", adjacentHitCoords);

      while (
        JSON.stringify(hitCoords).indexOf(JSON.stringify(coord)) != -1 &&
        adjacentHitCoords.length > 0
      ) {
        ind = Math.floor(Math.random() * adjacentHitCoords.length);
        coord = adjacentHitCoords[ind];
        adjacentHitCoords = adjacentHitCoords
          .slice(0, ind)
          .concat(adjacentHitCoords.slice(ind + 1));
      }
      console.log("aHC", adjacentHitCoords);
      console.log("hC", hitCoords);
      console.log(coord);
      setAdjacentHitCoords(adjacentHitCoords);
      if (JSON.stringify(hitCoords).indexOf(JSON.stringify(coord)) == -1) {
        console.log("return: ", coord);

        return coord;
      }
    }
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);

    while (JSON.stringify(hitCoords).indexOf(JSON.stringify([x, y])) != -1) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    }

    return [x, y];
  }

  return { gameboard, randomHit };
}
