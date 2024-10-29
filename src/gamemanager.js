import Player from "./player.js";
import HUD from "./hud.js";

export default function gameManager(){
    let playerTurn = true
    const player = Player("player")
    let playerGridList = []
    const computer = Player("computer")
    let computerGridList = []

    const hud = HUD()
    
    function playerCalllback(i,j){
        if(playerTurn){
            if(computer.gameboard.recieveAttack([i,j]) != "alreadyHit"){
                console.log("Coordinate: (",i,",",j,")")
                playerTurn = !playerTurn 
               
                manageHitMarker(computerGridList[j-1][i-1])
               //manageShipHitDraw()
            }    
        }
    }

    function computerCalllback(i,j){
        if(!playerTurn){
            if(player.gameboard.recieveAttack([i,j])!="alreadyHit"){
                console.log("Coordinate: (",i,",",j,")")
                playerTurn = !playerTurn 
                manageHitMarker(playerGridList[j-1][i-1])
            }
        }
       // manageShipDraw()

    }

    function runGame(){
        playerGridList = hud.createGameBoardDisplay(document.querySelector("#left-board"),computerCalllback)
        computerGridList = hud.createGameBoardDisplay(document.querySelector("#right-board"),playerCalllback)  
        manageShipDraw()  
    }

    function manageShipDraw(){
        for(let ship of player.gameboard.ships){
            for(let coord of ship.coords){
                hud.drawShipMarker(playerGridList[coord[1]][coord[0]])
            }
        }
        for(let ship of computer.gameboard.ships){
            for(let coord of ship.coords){
                hud.drawShipMarker(computerGridList[coord[1]][coord[0]])
            }
        }
    }

    function manageShipHitDraw(){
        for(let s of computer.gameboard.ships){
            console.log(s)
            if(s.ship.isSunk()){
                for(let coord of s.coords){
                    hud.drawShipIsSunk(computerGridList[coord[1]][coord[0]])
                }
            }
        }
    }

    function manageHitMarker(div){
        let hasHitMarker = false
        for(let c of div.childNodes){
            if(c.classList.contains("hitMarker")){
                hasHitMarker = true
                break
            }
        }
        if(!hasHitMarker){
            hud.drawHitMarker(div)
        }
    }

    return {runGame}

}

