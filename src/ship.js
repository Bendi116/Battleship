export default function Ship(mL) {
  let maxLength = mL;
  let hitCount = 0;
  function hit() {
    if (hitCount < maxLength) {
      hitCount++;
    }
  } 
  
  function isSunk() {
    console.log("hit: ",hitCount," max: ",maxLength)
    return hitCount == maxLength;
  }
  return { hit, isSunk };
}

