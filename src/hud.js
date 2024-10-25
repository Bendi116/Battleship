function HUD(){
    function createGameBoardDisplay(parent){
        console.log(parent)
        const gridSize = 50

        for(let i = 0;i < 10;++i){
            const row = document.createElement("div")

            row.style.display = "flex"
            row.style.flexDirection = "row"
            row.style.height = gridSize + "px"
            for(let j = 0; j < 10; ++j){
                const col = document.createElement("div")
                //col.style.height = gridSize + "px"
                //col.style.width = gridSize + "px"
                col.innerText = 2
                addEventListener("click",()=>{console.log("1")})
                col.classList.add("grid")
                row.appendChild(col)
            }
            parent.appendChild(row)
        }

    }
    return {createGameBoardDisplay}
}

module.exports = HUD