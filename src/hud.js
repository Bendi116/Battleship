function HUD(){
    function createGameBoardDisplay(parent,callback){
        const gridSize = 50
        let divList = [] 
        
        for(let i = 0;i < 10;++i){
            let divRow = []
            const row = document.createElement("div")

            row.style.display = "flex"
            row.style.flexDirection = "row"
            row.style.height = gridSize + "px"
            for(let j = 0; j < 10; ++j){
                const col = document.createElement("div")
                col.addEventListener("click",()=>{
                    callback(i+1,j+1)
                }
                )
                col.classList.add("grid")
                row.appendChild(col)
                divRow.push(col)
            }
            divList.push(divRow)
            parent.appendChild(row)
        }

        return divList
    }

    function drawHitMarker(div){
        const circle = document.createElement("div")
        circle.classList.add("hitMarker")
        div.appendChild(circle)
    }

    return {createGameBoardDisplay, drawHitMarker}
}

module.exports = HUD