export default function HUD() {
  const contentDiv = document.getElementById("content");

  function createGameBoardDisplay(parent, callback = () => {}, setDropShip,removeSignal) {
    const gridSize = 50;
    let divList = [];

    for (let i = 0; i < 10; ++i) {

      let divRow = [];
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.flexDirection = "row";
      row.style.height = gridSize + "px";

      for (let j = 0; j < 10; ++j) {

        const col = document.createElement("div");
        addColEventListeners(col,i,j,callback,setDropShip,removeSignal)
        

        col.classList.add("grid");
        row.appendChild(col);
        divRow.push(col);
      }
      divList.push(divRow);
      parent.appendChild(row);
    }

    return divList;
  }

  function addColEventListeners(col,i,j,callback,setDropShip,removeSignal){
    col.addEventListener("click", () => {
      callback(j, i);
    });
    col.addEventListener("dragenter", (e) => {
      console.log(e)
      e.preventDefault();
      e.target.classList.add("drag-over");
      //nem csak a target hanem az összes érintett mező meg kéne hogy kapja!!!
    },{signal: removeSignal.signal});
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
    },{signal: removeSignal.signal});
    col.addEventListener("dragleave", (e) => {
      e.target.classList.remove("drag-over");
    },{signal: removeSignal.signal});
    
    col.addEventListener("drop", (e) => {
      console.log(e)
      e.target.classList.remove("drag-over");
      const data = e.dataTransfer.getData("text/plain");
      setDropShip(
        col,
        data.slice(0, data.indexOf(",")),
        data.slice(data.indexOf(",") + 1) == "true" ? "h" : "v",
      );
    },{signal: removeSignal.signal});
  
  }

  function drawHitMarker(div) {
    const circle = document.createElement("div");
    circle.classList.add("hitMarker");
    div.appendChild(circle);
  }

  function drawShipMarker(div) {
    div.classList.add("ship");
  }

  function drawComputerShipMarker(div) {
    div.classList.add("cShip");
  }

  function drawShipIsSunk(div) {
    div.classList.add("sunk");
  }

  function createWinScreen(winner) {
    delAllChildOfContentDiv();
    contentDiv.innerText = winner + " win the game!";
    contentDiv.classList.add("winScreen");
  }

  function createStartScreen(callback) {
    const startBtn = document.createElement("button");
    startBtn.id = "startBtn";
    startBtn.addEventListener("click", () => {
      callback();
      hideStartBtn();
    });
    startBtn.innerText = "Start";
    contentDiv.appendChild(startBtn);
  }

  function hideStartBtn() {
    const startBtn = document.getElementById("startBtn");
    contentDiv.removeChild(startBtn);
  }

  function createHoriontalPlacementInput(){
    
    const horiontalPlacementInput = document.createElement("input");
    horiontalPlacementInput.type = "radio";
    horiontalPlacementInput.id = "horizontal";
    horiontalPlacementInput.name = "placmentDirection";
    horiontalPlacementInput.checked = true;

    return horiontalPlacementInput
  }

  function createVerticalPlacementInput(){
    
    const verticalPlacementInput = document.createElement("input");
    verticalPlacementInput.type = "radio";
    verticalPlacementInput.id = "vertical";
    verticalPlacementInput.name = "placmentDirection";

    return verticalPlacementInput
  }

  function createHoriontalPlacementInputLabel(){
    const horiontalPlacementInputLabel = document.createElement("label");
    horiontalPlacementInputLabel.htmlFor = "horizontal";
    horiontalPlacementInputLabel.innerHTML = "Horizontal";
    return horiontalPlacementInputLabel
  }

  function createVerticalPlacementInputLabel(){
    const verticalPlacementInputLabel = document.createElement("label");
    verticalPlacementInputLabel.htmlFor = "vertical";
    verticalPlacementInputLabel.innerHTML = "Vertical";
    return verticalPlacementInputLabel
  }

  function createShipBoxConatiner(key){
    const ShipBoxConatiner = document.createElement("div");
    ShipBoxConatiner.classList.add("shipBoxContainer");
    ShipBoxConatiner.draggable = true;

    ShipBoxConatiner.addEventListener("dragstart", (e) => {
      const horzontalInput = document.getElementById("horizontal");

      e.dataTransfer.setData("text/plain", [key, horzontalInput.checked]);
    });

    return ShipBoxConatiner
  }

  function createAmountLabel(key,value){
    const amountLabel = document.createElement("div");
    amountLabel.id = `${key}-amount`;
    amountLabel.innerText = `X ${value}`;
    return amountLabel
  }

  function createShipPlacementBox(shipPlacementDict, startGameCallBack) {
    const shipPlacementDiv = document.createElement("div");
    shipPlacementDiv.id = "shipPlacmentDiv";

    const horiontalPlacementInput = createHoriontalPlacementInput();
    const horiontalPlacementInputLabel = createHoriontalPlacementInputLabel()
    const verticalPlacementInput = createVerticalPlacementInput()
    const verticalPlacementInputLabel = createVerticalPlacementInputLabel()

    shipPlacementDiv.appendChild(horiontalPlacementInput);
    shipPlacementDiv.appendChild(horiontalPlacementInputLabel);
    shipPlacementDiv.appendChild(verticalPlacementInput);
    shipPlacementDiv.appendChild(verticalPlacementInputLabel);

    for (const [key, value] of Object.entries(shipPlacementDict)) {
      const div = document.createElement("div");
      div.id = `${key}-container`;
      div.classList.add("shipPlacementOptionContainer");

      const ShipBoxConatiner = createShipBoxConatiner(key)

      for (let i = 0; i < parseInt(key); ++i) {

        const ShipBox = document.createElement("div");
        ShipBox.classList.add("ShipBox");
        ShipBoxConatiner.appendChild(ShipBox);

      }
      const amountLabel = createAmountLabel(key,value)
      verticalPlacementInput.addEventListener("input", () => {
        ShipBoxConatiner.classList.add("rotate");
      });
      horiontalPlacementInput.addEventListener("input", () => {
        ShipBoxConatiner.classList.remove("rotate");
      });

      div.appendChild(ShipBoxConatiner);
      div.appendChild(amountLabel);

      shipPlacementDiv.appendChild(div);
    }

    const startGameBtn = createStartGameButton();

    startGameBtn.addEventListener("click", () => {
      contentDiv.removeChild(document.getElementById("shipPlacmentDiv"));
      contentDiv.removeChild(startGameBtn);
      startGameCallBack();
    });
    
    contentDiv.appendChild(shipPlacementDiv);
    contentDiv.appendChild(startGameBtn);
  }

  function delAllChildOfContentDiv() {
    while (contentDiv.firstChild) {
      contentDiv.removeChild(contentDiv.firstChild);
    }
  }

  function changeAmountLabel(id, value) {
    const label = document.getElementById(`${id}-amount`);
    label.innerText = `X ${value}`;
  }

  function createStartGameButton(callback) {
    const startGameBtn = document.createElement("button");
    startGameBtn.innerText = "Start Game";
    return startGameBtn;
  }

  return {
    createGameBoardDisplay,
    drawHitMarker,
    drawShipMarker,
    drawShipIsSunk,
    drawComputerShipMarker,
    createWinScreen,
    createStartScreen,
    createShipPlacementBox,
    changeAmountLabel,
    createStartGameButton  
  };
}
