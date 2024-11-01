import Player from "./player.js";
import HUD from "./hud.js";

export default function gameManager(){
    let playerTurn = true
    const player = Player("player")
    let playerGridList = []
    const computer = Player("computer")
    let computerGridList = []

    const hud = HUD()
    
    function playerCallback(i,j){
        if(computer.gameboard.recieveAttack([i,j]) != "alreadyHit"){
                playerTurn = !playerTurn 
                manageHitMarker(computerGridList[j][i])
                manageComputerShipHitDraw()
                let [x,y] = computer.randomHit(player.gameboard.getHitCoords())
                player.gameboard.recieveAttack([x,y])
                manageHitMarker(playerGridList[y][x])
                managePlayerShipHitDraw()
            }    
        
    }
/*
    function computerCallback(i,j){
        if(!playerTurn){
            if(player.gameboard.recieveAttack([i,j])!="alreadyHit"){
                playerTurn = !playerTurn 
                manageHitMarker(playerGridList[j][i])
                managePlayerShipHitDraw()
            }
        }

    }*/

    function runGame(){
        playerGridList = hud.createGameBoardDisplay(document.querySelector("#left-board"),()=>{})
        computerGridList = hud.createGameBoardDisplay(document.querySelector("#right-board"),playerCallback)  
        manageShipDraw()  
    }

    function manageShipDraw(){
        for(let ship of player.gameboard.getShips()){
            for(let coord of ship.coords){
                hud.drawShipMarker(playerGridList[coord[1]][coord[0]])
            }
        }
        for(let ship of computer.gameboard.getShips()){
            for(let coord of ship.coords){
                hud.drawComputerShipMarker(computerGridList[coord[1]][coord[0]])
            }
        }
    }

    function manageComputerShipHitDraw(){
        for(let s of computer.gameboard.getShips()){
            if(s.ship.isSunk()){
                for(let coord of s.coords){

                    hud.drawShipIsSunk(computerGridList[coord[1]][coord[0]])
                    hitComputerAdjacent(coord)
                }
            }
        }

     
    }

    function managePlayerShipHitDraw(){
        for(let s of player.gameboard.getShips()){
            if(s.ship.isSunk()){
                for(let coord of s.coords){
                    hud.drawShipIsSunk(playerGridList[coord[1]][coord[0]])
                    hitPlayerAdjacent(coord)
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


    function hitPlayerAdjacent(coord){
        for(let i = -1;i<2;++i){
            for(let j = -1;j<2;++j){
                if(coord[0]+i >= 0 && coord[0]+i <= 9 && coord[1]+j >= 0 && coord[1]+j <= 9){
                    player.gameboard.recieveAttack([coord[0]+i,coord[1]+j])
                    manageHitMarker(playerGridList[coord[1]+j][coord[0]+i])
                }
            }
        }
    }

    function hitComputerAdjacent(coord){
        for(let i = -1;i<2;++i){
            for(let j = -1;j<2;++j){
                if(coord[0]+i >= 0 && coord[0]+i <= 9 && coord[1]+j >= 0 && coord[1]+j <= 9){
                    computer.gameboard.recieveAttack([coord[0]+i,coord[1]+j])
                    manageHitMarker(computerGridList[coord[1]+j][coord[0]+i])
                }
            }
        }
    }

    return {runGame}

}

