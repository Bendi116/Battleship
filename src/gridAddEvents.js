//add event listeners to given grid
export default function addGridEventListeners(
  col,
  i,
  j,
  playerTurnCallBack,
  handleDragEventData,
  removeSignal,
  draggedData,
) {
  //click event
  gridAddClick(col, i, j, playerTurnCallBack);
  //add dragenter event
  gridAddDragEnter(col, handleDragEventData, removeSignal, draggedData);
  //add dragover event
  gridAddDragOver(col, removeSignal);
  //add dragleave event
  gridAddDragLeave(col, handleDragEventData, removeSignal, draggedData);
  //add drop event
  gridAddDrop(col, handleDragEventData, removeSignal, draggedData);
}

//add click event
function gridAddClick(col, i, j, playerTurnCallBack) {
  col.addEventListener("click", () => {
    playerTurnCallBack(j, i);
  });
}

//add dragenter event
function gridAddDragEnter(col, handleDragEventData, removeSignal, draggedData) {
  col.addEventListener(
    "dragenter",
    (e) => {
      handleDragEventData(
        col,
        draggedData.size,
        draggedData.alignment == true ? "h" : "v",
        e.type,
      );
    },
    { signal: removeSignal.signal },
  );
}

//add dragover event
function gridAddDragOver(col, removeSignal) {
  col.addEventListener(
    "dragover",
    (e) => {
      e.preventDefault();
    },
    { signal: removeSignal.signal },
  );
}

//add dragleave event
function gridAddDragLeave(col, handleDragEventData, removeSignal, draggedData) {
  col.addEventListener(
    "dragleave",
    (e) => {
      handleDragEventData(
        col,
        draggedData.size,
        draggedData.alignment == true ? "h" : "v",
        e.type,
      );
    },
    { signal: removeSignal.signal },
  );
}
//add drop event
function gridAddDrop(col, handleDragEventData, removeSignal, draggedData) {
  col.addEventListener(
    "drop",
    (e) => {
      const data = e.dataTransfer.getData("text/plain");
      handleDragEventData(
        col,
        data.slice(0, data.indexOf(",")),
        data.slice(data.indexOf(",") + 1) == "true" ? "h" : "v",
        e.type,
      );
      e.preventDefault();
      draggedData.alignment = null;
      draggedData.size = 0;
    },
    { signal: removeSignal.signal },
  );
}
