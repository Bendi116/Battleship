import Player from "./player.js";
import HUD from "./hud.js";
import classListHandler from "./classListHandler.js";
import animationHandler  from "./animationHandler.js";



export default function gameManager() {
  const player = Player("player");
  let playerGridList = [];
  const computer = Player("computer");
  let computerGridList = [];
  const controllerSignal = new AbortController();
  const shipPlacementDict = {
    1: 4,
    2: 3,
    3: 2,
    4: 1,
  };
  const hud = HUD();
  const cLHandler = classListHandler();
  const aHandler = animationHandler()
 

  let enabelPlayerAction = true;

  //functions

  function mainEventCallback(i, j) {
    if (enabelPlayerAction) {
      if (computer.gameboard.recieveAttack([i, j]) != "alreadyHit") {
        playerTurn(i, j);
        enabelPlayerAction = false;
        setTimeout(() => {
          computerTurn();
          enabelPlayerAction = true;
        }, 1000);
      }
    }
  }

  function playerTurn(i, j) {
    //todo
    aHandler.addHitAnimation(computerGridList[j][i]);
    manageHitMarker(computerGridList[j][i]);
    manageComputerShipHitDraw();
    if (computer.gameboard.allShipSunk()) {
      playerWin();
    }
  }

  function computerTurn() {
    let [x, y] = computer.randomHit(
      player.gameboard.getHitCoords(),
      player.gameboard.getAdjacentHitCoords(),
      (aHC) => {
        player.gameboard.setAdjacentHitCoords(aHC);
      },
    );
    player.gameboard.recieveAttack([x, y]);
    //todo
    aHandler.addHitAnimation(playerGridList[y][x]);
    manageHitMarker(playerGridList[y][x]);
    managePlayerShipHitDraw();

    if (player.gameboard.allShipSunk()) {
      computerWin();
    }
  }

  function playerWin() {
    hud.createWinScreen("PLayer");
  }

  function computerWin() {
    hud.createWinScreen("Computer");
  }

  function runGame() {
    hud.createStartScreen(() => {
      startShipPlacement();
    });
  }

  function startShipPlacement() {
    playerGridList = hud.createGameBoardDisplay(
      document.querySelector("#left-board"),
      () => {},
      getDropGrid,
      controllerSignal,
    );

    hud.createShipPlacementBox(shipPlacementDict, startGame, aHandler.addShipImage);
    hud.createStartGameButton();
  }

  function startGame() {
    controllerSignal.abort();
    computerGridList = hud.createGameBoardDisplay(
      document.querySelector("#right-board"),
      mainEventCallback,
      () => {},
      controllerSignal,
    );
    manageComputerBoardShipDraw();
  }

  function manageComputerBoardShipDraw() {
    for (let ship of computer.gameboard.getShips()) {
      aHandler.addShipImage(
        computerGridList[ship.coords[0][1]][ship.coords[0][0]],
        ship.size,
        ship.alignment,
      );
      for (let coord of ship.coords) {
        cLHandler.addcShipMarkerClass(computerGridList[coord[1]][coord[0]]);
      }
    }
  }

  function manageComputerShipHitDraw() {
    for (let s of computer.gameboard.getShips()) {
      if (s.ship.isSunk()) {
        for (let coord of s.coords) {
          cLHandler.addShipIsSunkClass(computerGridList[coord[1]][coord[0]]);
          hitComputerAdjacent(coord);
        }
      }
    }
  }

  function managePlayerShipHitDraw() {
    for (let s of player.gameboard.getShips()) {
      if (s.ship.isSunk()) {
        for (let coord of s.coords) {
          cLHandler.addShipIsSunkClass(playerGridList[coord[1]][coord[0]]);
          hitPlayerAdjacent(coord);
        }
      }
    }
  }

  function manageHitMarker(div) {
    let hasHitMarker = false;
    for (let c of div.childNodes) {
      if (c.classList.contains("hitMarker")) {
        hasHitMarker = true;
        break;
      }
    }
    if (!hasHitMarker) {
      cLHandler.addHitMarkerClass(div);
    }
  }

  //helper
  function hitPlayerAdjacent(coord) {
    for (let i = -1; i < 2; ++i) {
      for (let j = -1; j < 2; ++j) {
        if (
          coord[0] + i >= 0 &&
          coord[0] + i <= 9 &&
          coord[1] + j >= 0 &&
          coord[1] + j <= 9
        ) {
          player.gameboard.recieveAttack([coord[0] + i, coord[1] + j]);
          manageHitMarker(playerGridList[coord[1] + j][coord[0] + i]);
        }
      }
    }
  }

  //helper
  function hitComputerAdjacent(coord) {
    for (let i = -1; i < 2; ++i) {
      for (let j = -1; j < 2; ++j) {
        if (
          coord[0] + i >= 0 &&
          coord[0] + i <= 9 &&
          coord[1] + j >= 0 &&
          coord[1] + j <= 9
        ) {
          computer.gameboard.recieveAttack([coord[0] + i, coord[1] + j]);
          manageHitMarker(computerGridList[coord[1] + j][coord[0] + i]);
        }
      }
    }
  }

  //helper
  function findGrid(div) {
    for (const row of playerGridList) {
      for (const col of row) {
        if (col == div) {
          return col;
        }
      }
    }
  }

  //helper
  function getGridIndex(grid) {
    for (const row of playerGridList) {
      for (const col of row) {
        if (col == grid) {
          let x = row.indexOf(col);
          let y = playerGridList.indexOf(row);
          return [parseInt(x), parseInt(y)];
        }
      }
    }
  }

  function getDropGrid(grid, size, alignment, type) {
    // const col = findGrid(grid);
    const [x, y] = getGridIndex(grid);
    size = parseInt(size);
    if (type == "drop") {
      createDropShip([x, y], size, alignment);
    } else if (type == "dragenter") {
      handleDragEnter([x, y], size, alignment);
    }
  }
  function createDropShip([x, y], size, alignment) {
    player.gameboard.createShip(size, [x, y], alignment);
    // hud.drawShipMarker(col);
    aHandler.addShipImage(playerGridList[y][x], size, alignment);

    if (alignment == "h") {
      for (let i = 0; i < size; ++i) {
        cLHandler.addShipMarkerClass(playerGridList[y][x + i]);
        cLHandler.removeDragOverClass(playerGridList[y][x + i]);
      }
    } else {
      for (let i = 0; i < size; ++i) {
        cLHandler.addShipMarkerClass(playerGridList[y + i][x]);
        cLHandler.removeDragOverClass(playerGridList[y + i][x]);
      }
    }
    shipPlacementDict[size]--;
    hud.changeAmountLabel(size, shipPlacementDict[size]);
  }

  function clearDragOverClass() {
    for (const row of playerGridList) {
      for (const col of row) {
        cLHandler.removeDragOverClass(col);
      }
    }
  }

  function handleDragEnter([x, y], size, alignment) {
    //clear all
    clearDragOverClass();

    if (alignment == "h" && x + size <= 10) {
      for (let i = 0; i < size; ++i) {
        if (x + i > 9) break;
        cLHandler.addDragOverClass(playerGridList[y][x + i]);
      }
    } else if (alignment == "v" && y + size <= 10) {
      for (let i = 0; i < size; ++i) {
        if (y + i > 9) break;
        cLHandler.addDragOverClass(playerGridList[y + i][x]);
      }
    }
  }



  return { runGame };
}
