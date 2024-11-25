export function createHoriontalPlacementInput() {
    const horiontalPlacementInput = document.createElement("input")
    horiontalPlacementInput.type = "radio"
    horiontalPlacementInput.id = "horizontal"
    horiontalPlacementInput.name = "placmentDirection"
    horiontalPlacementInput.checked = true

    horiontalPlacementInput.addEventListener("input", () => {
        Array.from(document.getElementsByClassName("shipBoxContainer")).forEach(
            (div) => (div.style.rotate = "0deg"),
        )
    })

    return horiontalPlacementInput
}

export function createVerticalPlacementInput() {
    const verticalPlacementInput = document.createElement("input")
    verticalPlacementInput.type = "radio"
    verticalPlacementInput.id = "vertical"
    verticalPlacementInput.name = "placmentDirection"

    verticalPlacementInput.addEventListener("input", () => {
        Array.from(document.getElementsByClassName("shipBoxContainer")).forEach(
            (div) => (div.style.rotate = "90deg"),
        )
    })

    return verticalPlacementInput
}

export function createHoriontalPlacementInputLabel() {
    const horiontalPlacementInputLabel = document.createElement("label")
    horiontalPlacementInputLabel.htmlFor = "horizontal"
    horiontalPlacementInputLabel.innerHTML = "Horizontal"

    return horiontalPlacementInputLabel
}

export function createVerticalPlacementInputLabel() {
    const verticalPlacementInputLabel = document.createElement("label")
    verticalPlacementInputLabel.htmlFor = "vertical"
    verticalPlacementInputLabel.innerHTML = "Vertical"
    return verticalPlacementInputLabel
}

export function createContainer(key, draggedData, clearDragOverClass) {
    const container = document.createElement("div")
    container.draggable = true
    container.classList.add("dragContainer")

    container.addEventListener("dragstart", (e) => {
        const horzontalInput = document.getElementById("horizontal")
        draggedData.size = key
        draggedData.alignment = horzontalInput.checked
        e.dataTransfer.setData("text/plain", [key, horzontalInput.checked])
    })
    container.addEventListener("dragend", () => {
        clearDragOverClass()
    })
    return container
}

export function createAmountLabel(key, value) {
    const amountLabel = document.createElement("div")
    amountLabel.id = `${key}-amount`
    amountLabel.innerText = `${value}X`
    return amountLabel
}

export function createStartGameButton(startGameCallBack, allShipIsPlaced) {
    const startGameBtn = document.createElement("button")
    startGameBtn.innerText = "Start Game"
    startGameBtn.id = "startGameBtn"

    startGameBtn.addEventListener("click", () => {
        if (allShipIsPlaced()) {
            document.getElementById("shipPlacmentDiv").remove()
            startGameBtn.remove()
            startGameCallBack()
        }
    })

    return startGameBtn
}

export function createShipPlacementOptionContainer(key) {
    const div = document.createElement("div")
    div.id = `${key}-container`
    div.classList.add("shipPlacementOptionContainer")

    return div
}

export function createShipBoxContainer() {
    const ShipBoxConatiner = document.createElement("div")
    ShipBoxConatiner.classList.add("shipBoxContainer")
    return ShipBoxConatiner
}

export function createRow() {
    const row = document.createElement("div")
    row.classList.add("row")
    //  row.style.height = gridSize + "px";
    return row
}

export function createCol() {
    const col = document.createElement("div")
    col.classList.add("grid")
    return col
}

export function createShipBox() {
    const ShipBox = document.createElement("div")
    ShipBox.classList.add("shipBox")
    return ShipBox
}
