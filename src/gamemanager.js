import Player from "./player.js";
import HUD from "./hud.js";

function gameManager(){
    let playerTurn = true
    const player = Player("player")
    let playerGridList = []
    const computer = Player("computer")
    let computerGridList = []

    const hud = HUD()
    
    function playerCalllback(i,j){
        if(playerTurn){
            if(player.gameboard.recieveAttack([i,j]) != "alreadyHit"){
                console.log("Coordinate: (",i,",",j,")")
                console.log(player.gameboard.hitCoords)
                playerTurn = !playerTurn 
                manageHitMarker(playerGridList[i-1][j-1])
            }    
        }
    }

    function computerCalllback(i,j){
        if(!playerTurn){
            console.log("Coordinate: (",i,",",j,")")
            if(computer.gameboard.recieveAttack([i,j])!="alreadyHit"){
                playerTurn = !playerTurn 
                manageHitMarker(computerGridList[i-1][j-1])
            }
        }
    }

    function runGame(){
        playerGridList = hud.createGameBoardDisplay(document.querySelector("#left-board"),playerCalllback)
        computerGridList = hud.createGameBoardDisplay(document.querySelector("#right-board"),computerCalllback)    
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

export default gameManager