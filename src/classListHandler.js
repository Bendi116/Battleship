export default function classListHandler() {
    //add drag-over css class
    function addDragOverClass(div) {
        div.classList.add("drag-over")
    }

    //remove drag-over css class
    function removeDragOverClass(div) {
        div.classList.remove("drag-over")
    }

    //add hit marker css class
    function addHitMarkerClass(div) {
        const circle = document.createElement("div")
        circle.classList.add("hitMarker")
        div.appendChild(circle)
    }

    //add ship marker css class
    function addShipMarkerClass(div) {
        div.classList.add("ship")
    }
    //add computer ship marker css class
    function addcShipMarkerClass(div) {
        div.classList.add("cShip")
    }
    //add sunk css class
    function addShipIsSunkClass(div) {
        div.classList.add("sunk")
    }

    return {
        addDragOverClass,
        removeDragOverClass,
        addHitMarkerClass,
        addShipMarkerClass,
        addcShipMarkerClass,
        addShipIsSunkClass,
    }
}
