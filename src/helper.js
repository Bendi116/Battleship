export function hitAdjacent(coord, gameboard, gridList, manageHitMarker) {
    for (let i = -1; i < 2; ++i) {
        for (let j = -1; j < 2; ++j) {
            if (
                coord[0] + i >= 0 &&
                coord[0] + i <= 9 &&
                coord[1] + j >= 0 &&
                coord[1] + j <= 9
            ) {
                gameboard.recieveAttack([coord[0] + i, coord[1] + j])
                manageHitMarker(gridList[coord[1] + j][coord[0] + i])
            }
        }
    }
}
/*
export function findGrid(div) {
    for (const row of playerGridList) {
        for (const col of row) {
        if (col == div) {
            return col;
        }
        }
    }
}
    */

export function getGridIndex(grid, gridList) {
    for (const row of gridList) {
        for (const col of row) {
            if (col == grid) {
                let x = row.indexOf(col)
                let y = gridList.indexOf(row)
                return [parseInt(x), parseInt(y)]
            }
        }
    }
}
