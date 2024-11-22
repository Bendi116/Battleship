//image imports
import aircraftCarrier from "./images/AircraftCarrier.png"; //size 4 ship
import battleShip from "./images/BattleShip.png"; //size 3 ship
import cruiser from "./images/Cruiser.png"; //size 2 ship
import patrolBoat from "./images/PatrolBoat.png"; //size 1 ship

//gifs
import hitGif from "./images/hit.gif";
import waterHitGif from "./images/waterHit.gif";
import fireEffect from "./images/fireEffect.gif";

export default function animationHandler(){
    const shipImages = {
        4: aircraftCarrier,
        3: battleShip,
        2: cruiser,
        1: patrolBoat,
        };

    function addShipImage(shipDiv, size, alignment) {
        const shipImg = document.createElement("img");
        shipImg.src = shipImages[size];
        shipImg.classList.add("shipImg");
        shipImg.classList.add(`size${size}ShipImg`);
        if (alignment == "v") shipImg.classList.add("vertivalShipImg");
        shipDiv.appendChild(shipImg);
    }

    function addHitAnimation(div) {
        const img = document.createElement("img");
        if (div.classList.contains("cShip") || div.classList.contains("ship")) {
        img.src = hitGif;
        img.classList.add("hitGif");
        setTimeout(() => {
            img.src = fireEffect;
            img.classList.remove("hitGif");
            img.classList.add("fireEffect");
        }, 910);
        } else {
        img.src = waterHitGif;
        img.classList.add("waterHitGif");
        setTimeout(() => {
            img.remove();
        }, 1300);
        }

        div.appendChild(img);
    }

    return {addHitAnimation,addShipImage}
}