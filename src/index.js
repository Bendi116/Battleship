import "./style.css";
import Player from "./player.js";
import HUD from "./hud.js";


const player = Player("player")
const hud = HUD()
hud.createGameBoardDisplay(document.querySelector("#left-board"))

