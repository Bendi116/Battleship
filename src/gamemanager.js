import Player from "./player.js"
import HUD from "./hud.js"
import classListHandler from "./classListHandler.js"
import animationHandler from "./animationHandler.js"
import { getGridIndex, hitAdjacent } from "./helper.js"

export default function gameManager() {
    //const factory funtions instanceses
    const player = Player("player")
    const computer = Player("computer")
    const cLHandler = classListHandler()
    const aHandler = animationHandler()
    const hud = HUD()

    //dict for ship placment ,show how much ships can be placed from one type
    const shipPlacementDict = {
        1: 1,
        2: 1,
        3: 1,
        4: 1,
    }

    //gridLists of the gamenoard matrixes div elements
    let playerGridList = []
    let computerGridList = []

    //controller signal for drag evetns
    const controllerSignal = new AbortController()

    let enabelPlayerAction = true

    //functions

    //its trigger when player choose a grid and fire than the computer player comes reapedatly
    function mainEventCallback(i, j) {
        if (enabelPlayerAction) {
            if (computer.gameboard.recieveAttack([i, j]) != "alreadyHit") {
                playerTurn(i, j)
                enabelPlayerAction = false
                setTimeout(() => {
                    computerTurn()
                    enabelPlayerAction = true
                }, 1000)
            }
        }
    }

    //handle player turn
    function playerTurn(i, j) {
        aHandler.addHitAnimation(computerGridList[j][i])
        placeHitMarker(computerGridList[j][i])
        handleShipIsSunk(computer.gameboard, computerGridList)
        if (computer.gameboard.allShipSunk()) {
            hud.createWinScreen("PLayer")
        }
    }

    //handle computer turn with random hit
    function computerTurn() {
        let [x, y] = computer.randomHit(
            player.gameboard.getHitCoords(),
            player.gameboard.getAdjacentHitCoords(),
            (aHC) => {
                player.gameboard.setAdjacentHitCoords(aHC)
            },
        )
        player.gameboard.recieveAttack([x, y])
        aHandler.addHitAnimation(playerGridList[y][x])
        placeHitMarker(playerGridList[y][x])
        handleShipIsSunk(player.gameboard, playerGridList)
        if (player.gameboard.allShipSunk()) {
            hud.createWinScreen("Computer")
        }
    }

    //start game , create a start button
    function runGame() {
        hud.createStartScreen(() => {
            startShipPlacement()
        })
    }

    //handle ship placment phase
    function startShipPlacement() {
        playerGridList = hud.createGameBoardDisplay(
            document.querySelector("#left-board"),
            () => {},
            handleDragEventData,
            controllerSignal,
        )

        hud.createShipPlacementBox(
            shipPlacementDict,
            startGame,
            aHandler.addShipImage,
            allShipIsPlaced,
            clearDragOverClass,
        )
        hud.createStartGameButton()
    }

    //the game starter function create and draw enemy board , remove drag events from col and
    function startGame() {
        controllerSignal.abort()
        computerGridList = hud.createGameBoardDisplay(
            document.querySelector("#right-board"),
            mainEventCallback,
            () => {},
            controllerSignal,
        )
       drawComputerShips()
    }

    //draw computer ship with images
    function drawComputerShips() {
        for (let ship of computer.gameboard.getShips()) {
            for (let coord of ship.coords) {
                cLHandler.addcShipMarkerClass(
                    computerGridList[coord[1]][coord[0]],
                )
            }
        }
    }

    //find if a ship is sunk and handle its effects
    function handleShipIsSunk(gameboard, gridList) {
        for (let ship of gameboard.getShips()) {
            if (ship.ship.isSunk()) {
                if (gameboard == computer.gameboard) {
                    aHandler.addShipImage(
                        computerGridList[ship.coords[0][1]][ship.coords[0][0]],
                        ship.size,
                        ship.alignment,
                    )
                }
                for (let coord of ship.coords) {
                   // cLHandler.addShipIsSunkClass(gridList[coord[1]][coord[0]])
                    hitAdjacent(coord, gameboard, gridList, placeHitMarker)
                }
            }
        }
    }

    //place a hit marker in the current grid div
    function placeHitMarker(div) {
        let hasHitMarker = false
        for (let c of div.childNodes) {
            if (c.classList.contains("hitMarker")) {
                hasHitMarker = true
                break
            }
        }
        if (!hasHitMarker) {
            cLHandler.addHitMarkerClass(div)
        }
    }

    //get data from drag event
    function handleDragEventData(grid, size, alignment, type) {
        const [x, y] = getGridIndex(grid, playerGridList)
        size = parseInt(size)
        if (type == "drop") {
            createDropShip([x, y], size, alignment)
        } else if (type == "dragenter") {
            handleDragEnterEvent([x, y], size, alignment)
        }
    }

    //create a ship from drop event
    function createDropShip([x, y], size, alignment) {
        player.gameboard.createShip(size, [x, y], alignment)
        // hud.drawShipMarker(col);
        aHandler.addShipImage(playerGridList[y][x], size, alignment)

        if (alignment == "h") {
            for (let i = 0; i < size; ++i) {
                cLHandler.addShipMarkerClass(playerGridList[y][x + i])
                cLHandler.removeDragOverClass(playerGridList[y][x + i])
            }
        } else {
            for (let i = 0; i < size; ++i) {
                cLHandler.addShipMarkerClass(playerGridList[y + i][x])
                cLHandler.removeDragOverClass(playerGridList[y + i][x])
            }
        }
        shipPlacementDict[size]--
        hud.changeAmountLabel(size, shipPlacementDict[size])
    }

    //clear all drag-over class in the gameboard matrix
    function clearDragOverClass() {
        for (const row of playerGridList) {
            for (const col of row) {
                cLHandler.removeDragOverClass(col)
            }
        }
    }

    //handle what should happens when a dragged ship enter into a gameboard grid
    function handleDragEnterEvent([x, y], size, alignment) {
        //clear all
        clearDragOverClass()

        if (alignment == "h" && x + size <= 10) {
            for (let i = 0; i < size; ++i) {
                if (x + i > 9) break
                cLHandler.addDragOverClass(playerGridList[y][x + i])
            }
        } else if (alignment == "v" && y + size <= 10) {
            for (let i = 0; i < size; ++i) {
                if (y + i > 9) break
                cLHandler.addDragOverClass(playerGridList[y + i][x])
            }
        }
    }

    function allShipIsPlaced() {
        console.log("eher")
        for (const value of Object.values(shipPlacementDict)) {
            console.log(value)
            if (value > 0) return false
        }
        return true
    }

    return { runGame }
}
