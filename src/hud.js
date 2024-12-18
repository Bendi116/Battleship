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
        createNumsLabel(parent)
        createCharsLabel(parent)
        //create grid 
        const matrix = document.createElement("div")
        matrix.id = "matrix"
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
            matrix.appendChild(row)
        }
        parent.appendChild(matrix)

        return divList
    }

    //create nums label
    function createNumsLabel(parent){
        const numLabelParent = document.createElement("div")
        numLabelParent.classList.add("num-label-parent")
        for (let index = 0; index < 10; index++) {
            const numLabel = document.createElement("div")
            numLabel.innerText=index+1   
            numLabelParent.appendChild(numLabel)
        }
        parent.appendChild(numLabelParent)
    }

     //create chars label
    function createCharsLabel(parent){
        const charLabelParent = document.createElement("div")
        charLabelParent.classList.add("char-label-parent")
        const chars = ['A','B',"C","D","E","F","G","H","I","J"]
        for (let index = 0; index < 10; index++) {
            const charLabel = document.createElement("div")
            charLabel.innerText=chars[index]  
            charLabelParent.appendChild(charLabel)
        }
        parent.appendChild(charLabelParent)
    } 

    //create win screen that dpened on the strin(winner) that it gets as a argument
    function createWinScreen(winner) {
        delAllChildOfContentDiv()

        const winScreenDiv = document.createElement("div")
        winScreenDiv.id="winScreen"
        winScreenDiv.innerText = winner + " win the game!"
        contentDiv.appendChild(winScreenDiv)
        
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
        const title = document.getElementById("title")
        title.id= "smallerTitle"

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
        const shipPlacementLabels = document.createElement("div")
        shipPlacementLabels.id = "shipPlacementLabels"

        //append new childes
        shipPlacementLabels.appendChild(horiontalPlacementInput)
        shipPlacementLabels.appendChild(horiontalPlacementInputLabel)
        shipPlacementLabels.appendChild(verticalPlacementInput)
        shipPlacementLabels.appendChild(verticalPlacementInputLabel)

        shipPlacementDiv.appendChild(shipPlacementLabels)


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
        shipPlacementDiv.appendChild(startGameBtn)
        contentDiv.appendChild(shipPlacementDiv)
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
