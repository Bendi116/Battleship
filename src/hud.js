import addGridEventListeners from "./gridAddEvents"
import {
    createCol,
    createRow,
    createShipBox,
    createHoriontalPlacementInput,
    createVerticalPlacementInput,
    createHoriontalPlacementInputLabel,
    createVerticalPlacementInputLabel,
    createContainer,
    createAmountLabel,
    createStartGameButton,
    createShipPlacementOptionContainer,
    createShipBoxContainer,
} from "./htmlElementCreater"

export default function HUD() {
    const contentDiv = document.getElementById("content")

    //used to transfer data in dragenter event
    const draggedData = {
        size: 0,
        alignment: "",
    }

    //create the grid matrix
    function createGameBoardDisplay(
        parent,
        playerTurnCallBack = () => {},
        handleDragEventData,
        removeSignal,
    ) {
        let divList = []
        for (let i = 0; i < 10; ++i) {
            let divRow = []
            const row = createRow()
            for (let j = 0; j < 10; ++j) {
                const col = createCol()
                addGridEventListeners(
                    col,
                    i,
                    j,
                    playerTurnCallBack,
                    handleDragEventData,
                    removeSignal,
                    draggedData,
                )
                row.appendChild(col)
                divRow.push(col)
            }
            divList.push(divRow)
            parent.appendChild(row)
        }

        return divList
    }

    //create win screen that dpened on the strin(winner) that it gets as a argument
    function createWinScreen(winner) {
        delAllChildOfContentDiv()
        contentDiv.innerText = winner + " win the game!"
        contentDiv.classList.add("winScreen")
    }

    //create start screen
    function createStartScreen(callback) {
        const startBtn = document.createElement("button")
        startBtn.id = "startBtn"
        startBtn.addEventListener("click", () => {
            callback()
            hideStartBtn()
        })
        startBtn.innerText = "Start"
        contentDiv.appendChild(startBtn)
    }

    //clear the contentDiv
    function delAllChildOfContentDiv() {
        while (contentDiv.firstChild) {
            contentDiv.removeChild(contentDiv.firstChild)
        }
    }

    //change the amount of ship that the player could place
    function changeAmountLabel(id, value) {
        const label = document.getElementById(`${id}-amount`)
        label.innerText = `${value}X`
        if (value == 0) {
            label.nextSibling.draggable = false
        }
    }

    //hide start button
    function hideStartBtn() {
        const startBtn = document.getElementById("startBtn")
        contentDiv.removeChild(startBtn)
    }

    function createShipPlacementBox(
        shipPlacementDict,
        startGameCallBack,
        createShipImage,
        allShipIsPlaced,
        clearDragOverClass,
    ) {
        //main div in ship placment
        const shipPlacementDiv = document.createElement("div")
        shipPlacementDiv.id = "shipPlacmentDiv"

        //create the input and label html elements and startBtn
        const horiontalPlacementInput = createHoriontalPlacementInput()
        const horiontalPlacementInputLabel =
            createHoriontalPlacementInputLabel()
        const verticalPlacementInput = createVerticalPlacementInput()
        const verticalPlacementInputLabel = createVerticalPlacementInputLabel()
        console.log(allShipIsPlaced)
        const startGameBtn = createStartGameButton(
            startGameCallBack,
            allShipIsPlaced,
        )

        //append new childes
        shipPlacementDiv.appendChild(horiontalPlacementInput)
        shipPlacementDiv.appendChild(horiontalPlacementInputLabel)
        shipPlacementDiv.appendChild(verticalPlacementInput)
        shipPlacementDiv.appendChild(verticalPlacementInputLabel)

        for (const [key, value] of Object.entries(shipPlacementDict)) {
            //create divs
            const div = createShipPlacementOptionContainer(key)
            const container = createContainer(
                key,
                draggedData,
                clearDragOverClass,
            )
            const shipBoxConatiner = createShipBoxContainer()
            const amountLabel = createAmountLabel(key, value)

            for (let i = 0; i < parseInt(key); ++i) {
                const ShipBox = createShipBox()
                shipBoxConatiner.appendChild(ShipBox)
            }
            console.log(horiontalPlacementInput.checked)
            createShipImage(
                shipBoxConatiner,
                key,
                horiontalPlacementInput.checked == true ? "h" : "v",
            )

            //append new divs as child
            container.appendChild(shipBoxConatiner)
            div.appendChild(amountLabel)

            div.appendChild(container)
            shipPlacementDiv.appendChild(div)
        }

        //append childes
        contentDiv.appendChild(shipPlacementDiv)
        contentDiv.appendChild(startGameBtn)
    }

    return {
        createGameBoardDisplay,
        createWinScreen,
        createStartScreen,
        createShipPlacementBox,
        changeAmountLabel,
        createStartGameButton,
    }
}
