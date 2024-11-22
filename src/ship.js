export default function Ship(mL) {
    let maxLength = mL
    let hitCount = 0
    function hit() {
        if (hitCount < maxLength) {
            hitCount++
        }
    }

    function isSunk() {
        return hitCount == maxLength
    }
    return { hit, isSunk }
}
