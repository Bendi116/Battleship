import Ship from "./ship.js"

export default function Gameboard() {
    let ships = []
    let hitCoords = []
    let adjacentHitCoords = []
    let shipSizes = new Map()

    class shipInSea {
        constructor(_size, _coords, _alignment) {
            this.ship = Ship(_size)
            this.size = _size
            this.coords = [_coords]
            this.alignment = _alignment
            for (let i = 1; i < this.size; ++i) {
                if (this.alignment == "v") {
                    this.coords.push([_coords[0], _coords[1] + i])
                } else {
                    this.coords.push([_coords[0] + i, _coords[1]])
                }
            }
        }
    }

    function validateShipSize(_size) {
        if (_size < 0 || _size > 10) throw new Error("Invalid ship size.")
    }

    function validateAligment(_alignment) {
        if (["v", "h"].includes(_alignment) == false)
            throw new Error("Invalid ship alignment.")
    }

    function validateShipCoordinates(_coords) {
        if (_coords.length != 2) throw new Error("Coordinate size is wrong.")
    }

    function validateShipPlacement(_size, _coords, _alignment = "h") {
        if (_alignment == "v") {
            if (
                _coords[0] < 0 ||
                _coords[0] > 9 ||
                _coords[1] < 0 ||
                _coords[1] + _size > 10
            ) {
                throw new Error("Invalid ship placement.")
            }
        } else {
            if (
                _coords[0] < 0 ||
                _coords[0] + _size > 10 ||
                _coords[1] < 0 ||
                _coords[1] > 9
            ) {
                throw new Error("Invalid ship placement.")
            }
        }
    }

    function validateGrid(ship) {
        //Iterate through ship coords to see that the placement is a valid grid
        for (let s of ships) {
            for (let c in s.coords) {
                for (let newC in ship.coords) {
                    if (adjacentCoords(s.coords[c], ship.coords[newC])) {
                        throw new Error(
                            "Coordinates already contains a ship or too close to an other ship.",
                        )
                    }
                }
            }
        }
    }

    function createShip(_size, _coords, _alignment) {
        validateShipSize(_size)
        validateAligment(_alignment)
        validateShipCoordinates(_coords)
        validateShipPlacement(_size, _coords, _alignment)

        const ship = new shipInSea(_size, _coords, _alignment)

        validateGrid(ship)

        ships.push(ship)
        if (shipSizes.has(_size)) {
            shipSizes.set(_size, shipSizes.get(_size) + 1)
        } else {
            shipSizes.set(_size, 1)
        }
    }

    function validateGameboardCoords(coords) {
        if (coords[0] < 0 || coords[0] > 9 || coords[1] < 0 || coords[1] > 9) {
            throw new Error("Invalid gameboard coordinates.")
        }
    }

    function recieveAttack(coords) {
        validateShipCoordinates(coords)
        validateGameboardCoords(coords)
        if (JSON.stringify(hitCoords).indexOf(JSON.stringify(coords)) != -1) {
            return "alreadyHit"
        }

        hitCoords.push(coords)

        for (let ship of ships) {
            if (
                JSON.stringify(ship.coords).indexOf(JSON.stringify(coords)) !=
                -1
            ) {
                ship.ship.hit()
                if (!ship.ship.isSunk()) {
                    hitAdjacentCoords(coords)
                }
                return "hit"
            }
        }
        return "noHit"
    }
    function allShipSunk() {
        for (let s of ships) {
            if (!s.ship.isSunk()) return false
        }
        return true
    }

    function adjacentCoords(shipCoord, srcCoord) {
        if (
            (shipCoord[0] == srcCoord[0] && shipCoord[1] == srcCoord[1]) ||
            (shipCoord[0] - 1 == srcCoord[0] &&
                shipCoord[1] - 1 == srcCoord[1]) ||
            (shipCoord[0] == srcCoord[0] && shipCoord[1] - 1 == srcCoord[1]) ||
            (shipCoord[0] + 1 == srcCoord[0] &&
                shipCoord[1] - 1 == srcCoord[1]) ||
            (shipCoord[0] - 1 == srcCoord[0] && shipCoord[1] == srcCoord[1]) ||
            (shipCoord[0] + 1 == srcCoord[0] && shipCoord[1] == srcCoord[1]) ||
            (shipCoord[0] - 1 == srcCoord[0] &&
                shipCoord[1] + 1 == srcCoord[1]) ||
            (shipCoord[0] == srcCoord[0] && shipCoord[1] + 1 == srcCoord[1]) ||
            (shipCoord[0] + 1 == srcCoord[0] && shipCoord[1] + 1 == srcCoord[1])
        ) {
            return true
        }
        return false
    }

    function hitAdjacentCoords(hitCoord) {
        let coords = []
        for (let i = 0; i < 2; ++i) {
            if (i == 0) {
                if (hitCoord[1] - 1 >= 0) {
                    coords.push([hitCoord[0], hitCoord[1] - 1])
                }
            } else {
                if (hitCoord[1] + 1 <= 9) {
                    coords.push([hitCoord[0], hitCoord[1] + 1])
                }
            }
        }

        for (let i = 0; i < 2; ++i) {
            if (i == 0) {
                if (hitCoord[0] - 1 >= 0) {
                    coords.push([hitCoord[0] - 1, hitCoord[1]])
                }
            } else {
                if (hitCoord[0] + 1 <= 9) {
                    coords.push([hitCoord[0] + 1, hitCoord[1]])
                }
            }
        }
        for (const c of coords) {
            if (JSON.stringify(hitCoords).indexOf(JSON.stringify(c)) == -1) {
                adjacentHitCoords.push(c)
            }
        }
    }

    function getShips() {
        return ships
    }
    function getAdjacentHitCoords() {
        return adjacentHitCoords
    }

    function setAdjacentHitCoords(aHC) {
        adjacentHitCoords = aHC
    }

    function getHitCoords() {
        return hitCoords
    }

    return {
        createShip,
        recieveAttack,
        allShipSunk,
        getShips,
        getHitCoords,
        getAdjacentHitCoords,
        setAdjacentHitCoords,
    }
}
