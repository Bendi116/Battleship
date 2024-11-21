import Player from "./player.js";
import HUD from "./hud.js";

//image imports
import aircraftCarrier from "./images/AircraftCarrier.png" //size 4 ship
import battleShip from "./images/BattleShip.png"           //size 3 ship
import cruiser from "./images/Cruiser.png"                 //size 2 ship
import patrolBoat from "./images/PatrolBoat.png"           //size 1 ship
import hitGif from "./images/hit.gif"
import waterHitGif from "./images/waterHit.gif"
import fireEffect from "./images/fireEffect.gif"




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

  const shipImages = {
    4:aircraftCarrier,
    3:battleShip,
    2:cruiser,
    1:patrolBoat
  }


  function mainEventCallback(i, j) {
    if (computer.gameboard.recieveAttack([i, j]) != "alreadyHit") {
        playerTurn(i,j)
        computerTurn()
     

    }
  }

  function playerTurn(i,j){
        //todo
        addHitAnimation(computerGridList[j][i])
        //manageHitMarker(computerGridList[j][i]);
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
        //todo
       addHitAnimation(playerGridList[y][x])
        //manageHitMarker(playerGridList[y][x]);
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
    manageComputerBoardShipDraw();
  }

  function manageComputerBoardShipDraw() {

    for (let ship of computer.gameboard.getShips()) {
      createShipImage(computerGridList[ship.coords[0][1]][ship.coords[0][0]],ship.size,ship.alignment)
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
          //manageHitMarker(playerGridList[coord[1] + j][coord[0] + i]);
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
         // manageHitMarker(computerGridList[coord[1] + j][coord[0] + i]);
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

  function getDropGrid(grid, size, alignment,type) {
   // const col = findGrid(grid);
    const [x, y] = getGridIndex(grid);
    size = parseInt(size);
    if(type=="drop"){
      createDropShip([x, y], size, alignment)
    }else if(type=="dragenter"){
      handleDragEnter([x, y], size, alignment)
    }/*
    else if("drag-over"){
      if (alignment == "h" && x+size <= 10 ) {
        for (let i = 0; i < size; ++i){
          if(x+i>9) break
          hud.removeDragOverClass(playerGridList[y][x + i]);
        }
      } else if (alignment == "v" && y+size<=10) {
        for (let i = 0; i < size; ++i){
          if(y+i>9) break
         hud.removeDragOverClass(playerGridList[y + i][x]);
        }
      }
    }
      */
    }
  function createDropShip([x, y], size, alignment){
    player.gameboard.createShip(size, [x, y], alignment);
    // hud.drawShipMarker(col);
    createShipImage(playerGridList[y][x],size,alignment)

       if (alignment == "h") {

         for (let i = 0; i < size; ++i)
           {hud.drawShipMarker(playerGridList[y][x + i])
           hud.removeDragOverClass(playerGridList[y][x + i]);}
         ;
        } else {
         for (let i = 0; i < size; ++i)
           {hud.drawShipMarker(playerGridList[y + i][x]);
           hud.removeDragOverClass(playerGridList[y + i][x]);}

       }
     shipPlacementDict[size]--;
     hud.changeAmountLabel(size, shipPlacementDict[size]);
  }


  function clearDragOverClass(){
    for(const row of playerGridList){
      for(const col of row){
        hud.removeDragOverClass(col)
      }
    }
  }

  function handleDragEnter([x, y], size, alignment){
    //clear all
    clearDragOverClass()

    if (alignment == "h" && x+size <= 10 ) {    
      for (let i = 0; i < size; ++i){
        if(x+i>9) break
        hud.addDragOverClass(playerGridList[y][x + i]);
      }
    } else if (alignment == "v" && y+size<=10) {
      for (let i = 0; i < size; ++i){
        if(y+i>9) break
        hud.addDragOverClass(playerGridList[y + i][x]);
  }
    }
  }

  function createShipImage(shipDiv,size,alignment){
    const shipImg = document.createElement("img")
    shipImg.src= shipImages[size]
    shipImg.classList.add("shipImg")
    shipImg.classList.add(`size${size}ShipImg`)
    if(alignment=="v") shipImg.classList.add("vertivalShipImg")
      shipDiv.appendChild(shipImg)

  }


  function addHitAnimation(div){
    const img = document.createElement("img")
    console.log(div.classList)
    if(div.classList.contains("cShip") || div.classList.contains("ship")){
      img.src = hitGif
      img.classList.add("hitGif")
      setTimeout(
        ()=>{
          img.src = fireEffect
          img.classList.remove("hitGif")
          img.classList.add("fireEffect")
          //img.remove()
        },850
      )
    }else{
      img.src = waterHitGif
      img.classList.add("waterHitGif")
      setTimeout(
        ()=>{img.remove()},1300
      )

    }
  
    div.appendChild(img)
    
    
  }

  return { runGame };
}
