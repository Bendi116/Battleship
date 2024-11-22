//add event listeners to given grid
export default function addGridEventListeners(
    grid,
    i,
    j,
    playerTurnCallBack,
    handleDragEventData,
    removeSignal,
    draggedData,
) {
    //click event
    gridAddClick(grid, i, j, playerTurnCallBack)
    //add dragenter event
    gridAddDragEnter(grid, handleDragEventData, removeSignal, draggedData)
    //add dragover event
    gridAddDragOver(grid, removeSignal)
    //add dragleave event
    gridAddDragLeave(grid, handleDragEventData, removeSignal, draggedData)
    //add drop event
    gridAddDrop(grid, handleDragEventData, removeSignal, draggedData)
}

//add click event
function gridAddClick(grid, i, j, playerTurnCallBack) {
    grid.addEventListener("click", () => {
        playerTurnCallBack(j, i)
    })
}

//add dragenter event
function gridAddDragEnter(
    grid,
    handleDragEventData,
    removeSignal,
    draggedData,
) {
    grid.addEventListener(
        "dragenter",
        (e) => {
            handleDragEventData(
                grid,
                draggedData.size,
                draggedData.alignment == true ? "h" : "v",
                e.type,
            )
        },
        { signal: removeSignal.signal },
    )
}

//add dragover event
function gridAddDragOver(grid, removeSignal) {
    grid.addEventListener(
        "dragover",
        (e) => {
            e.preventDefault()
        },
        { signal: removeSignal.signal },
    )
}

//add dragleave event
function gridAddDragLeave(
    grid,
    handleDragEventData,
    removeSignal,
    draggedData,
) {
    grid.addEventListener(
        "dragleave",
        (e) => {
            handleDragEventData(
                grid,
                draggedData.size,
                draggedData.alignment == true ? "h" : "v",
                e.type,
            )
        },
        { signal: removeSignal.signal },
    )
}
//add drop event
function gridAddDrop(grid, handleDragEventData, removeSignal, draggedData) {
    grid.addEventListener(
        "drop",
        (e) => {
            const data = e.dataTransfer.getData("text/plain")
            handleDragEventData(
                grid,
                data.slice(0, data.indexOf(",")),
                data.slice(data.indexOf(",") + 1) == "true" ? "h" : "v",
                e.type,
            )
            e.preventDefault()
            draggedData.alignment = null
            draggedData.size = 0
        },
        { signal: removeSignal.signal },
    )
}
