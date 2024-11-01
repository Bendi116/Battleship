import Gameboard from "./gameboard";

export default function Player(type) {
  //costructor
  const gameboard = Gameboard();
  if (type == "player") {
    generateRandomGameBoard()
  } else if (type == "computer") {
    generateRandomGameBoard()
   
  } else {
    throw new Error("Invalid player type!");
  }

  function generateRandomGameBoard(){
    for(let i = 0; i < 4;++i){
      let counter = 0
      while (counter < 4-i) {
        try{
          let x = Math.floor(Math.random() * 10);
          let y = Math.floor(Math.random() * 10);
          if(Math.round(Math.random()) == 1){
            gameboard.createShip(i+1, [x, y],"v");
          }else{
            gameboard.createShip(i+1, [x, y],"h");
          }
          counter++
        }catch(err)
        {
          continue
        }
      }
    }
  }

  function randomHit(gb){
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    while(JSON.stringify(gb.getHitCoords()).indexOf(JSON.stringify([x,y]) != -1)){
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
    }
    gb.recieveAttack([x,y])
  }

  return { gameboard ,randomHit};
}

