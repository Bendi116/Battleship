import Player from "./player.js";
import HUD from "./hud.js";

export default function gameManager() {
  const player = Player("player");
  let playerGridList = [];
  const computer = Player("computer");
  let computerGridList = [];
  const controllerSignal =  new AbortController()
  const shipPlacementDict = {
    1: 4,
    2: 3,
    3: 2,
    4: 1,
  };
  const hud = HUD();

  function mainEventCallback(i, j) {
    if (computer.gameboard.recieveAttack([i, j]) != "alreadyHit") {

        playerTurn(i,j)
        computerTurn()
     

    }
  }

  function playerTurn(i,j){
        manageHitMarker(computerGridList[j][i]);
        manageComputerShipHitDraw();
        if (computer.gameboard.allShipSunk()) {
            playerWin();
        }
  }

  function computerTurn(){
        let [x, y] = computer.randomHit(
        player.gameboard.getHitCoords(),
        player.gameboard.getAdjacentHitCoords(),
        (aHC) => {
          player.gameboard.setAdjacentHitCoords(aHC);
        },
        );
        player.gameboard.recieveAttack([x, y]);

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
      controllerSignal
    );

    hud.createShipPlacementBox(shipPlacementDict, startGame);
    hud.createStartGameButton();
  }

  function startGame() {
    //remove event listeners in all col div
    /*
    for (const row of playerGridList) {
      for(const col of row){
        hud.removeColDragEventListeners(col)
      }
    }
      */
     controllerSignal.abort()
    
      
    computerGridList = hud.createGameBoardDisplay(
      document.querySelector("#right-board"),
      mainEventCallback,
      ()=>{},
      controllerSignal
    );
    manageShipDraw();
  }

  function manageShipDraw() {
    for (let ship of player.gameboard.getShips()) {
      for (let coord of ship.coords) {
        hud.drawShipMarker(playerGridList[coord[1]][coord[0]]);
      }
    }
    for (let ship of computer.gameboard.getShips()) {
      for (let coord of ship.coords) {
        hud.drawComputerShipMarker(computerGridList[coord[1]][coord[0]]);
      }
    }
  }

  function manageComputerShipHitDraw() {
    for (let s of computer.gameboard.getShips()) {
      if (s.ship.isSunk()) {
        for (let coord of s.coords) {
          hud.drawShipIsSunk(computerGridList[coord[1]][coord[0]]);
          hitComputerAdjacent(coord);
        }
      }
    }
  }

  function managePlayerShipHitDraw() {
    for (let s of player.gameboard.getShips()) {
      if (s.ship.isSunk()) {
        for (let coord of s.coords) {
          hud.drawShipIsSunk(playerGridList[coord[1]][coord[0]]);
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
      hud.drawHitMarker(div);
    }
  }

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

  function findGrid(div) {
    for (const row of playerGridList) {
      for (const col of row) {
        if (col == div) {
          return col;
        }
      }
    }
  }

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

  function getDropGrid(grid, size, alignment) {
    const col = findGrid(grid);
    const [x, y] = getGridIndex(grid);
    size = parseInt(size);
    player.gameboard.createShip(size, [x, y], alignment);
    hud.drawShipMarker(col);

    if (size > 1) {
      if (alignment == "h") {
        for (let i = 1; i < size; ++i)
          hud.drawShipMarker(playerGridList[y][x + i]);
      } else {
        for (let i = 1; i < size; ++i)
          hud.drawShipMarker(playerGridList[y + i][x]);
      }
    }
    shipPlacementDict[size]--;
    hud.changeAmountLabel(size, shipPlacementDict[size]);
  }

  return { runGame };
}
