import { VoidTile, PlainsTile } from '../models/Tile';
import CONST from '../CONST';


export function refineLandmass() {
  // 12 x 14 (168 Tiles)
  let emptyLandmass = createFilledLandmass(CONST.normalRowSize, CONST.normalColumnSize, PlainsTile);
  // create pool of removal blocks, (64 tiles)
  const blocks = [
    createEmptyLandmass(3, 4), //bg
    createEmptyLandmass(2, 3), //md
    createEmptyLandmass(3, 2), //md
    createEmptyLandmass(2, 2), //sm
    createEmptyLandmass(2, 2), //sm
    createEmptyLandmass(2, 2), //sm
    createEmptyLandmass(2, 2), //sm
  ];

  //        1
  //     ________
  // 4  |       |  2
  //    --------
  //        3
  const SidePool = [1, 2, 3, 4];
  let chosenSide = null;
  blocks.forEach((block) => {

    let chosenIndex = getRandomInt(0, SidePool.length - 1);
    // push back previously chosen side only after a new side is picked
    if (chosenSide) {
      SidePool.push(chosenSide)
    }
    chosenSide = SidePool.splice(chosenIndex, 1)[0];
    const orientationHorizontal = (chosenSide === 1 || chosenSide === 3);
    const maxSideRange = orientationHorizontal ? CONST.normalRowSize : CONST.normalColumnSize;
    let startRemovalCell = getRandomInt(0, maxSideRange - 1); // Array Position
    const currentBlockLength = orientationHorizontal ? block[0].length : block.length;

    // make sure block chunks arent falling out of bounds of array
    if ((startRemovalCell + currentBlockLength) > maxSideRange) {

      startRemovalCell = maxSideRange - currentBlockLength;
    }

    for (let i = currentBlockLength; i > 0; i--) {
      if (orientationHorizontal) {
        console.log(chosenSide)
        const chosenSideToArray = chosenSide === 1 ? 0 : maxSideRange - 1; // Array Position
        const cellToRemove = recursePositionHorizontal(emptyLandmass, chosenSideToArray, startRemovalCell);
        if (cellToRemove) {
          console.log('remove', cellToRemove)
          emptyLandmass[cellToRemove.x][cellToRemove.y] = null;
        }

      } else {
        // console.log('else vertical removal')
      }
    }


    console.log(chosenSide, maxSideRange, startRemovalCell, currentBlockLength)
  })

}

export function createEmptyLandmass(row, column) {
  const defaultLandArray = [];

  for (let i = row; i > 0; i--) {
    const newRow = [];
     for (let k = column; k > 0; k--) {
       let tile = new VoidTile(i,k);
       newRow.push(tile);
     }
    defaultLandArray.push(newRow);
  }

  return defaultLandArray;
}

export function createFilledLandmass(row, column, Tile) {
  const defaultLandArray = [];

  for (let i = 0; i < row; i++) {
    const newRow = [];
     for (let k = 0; k < column; k++) {
       let tile = new Tile(i,k, '');
       newRow.push(tile);
     }
    defaultLandArray.push(newRow);
  }

  return defaultLandArray;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function recursePositionHorizontal(emptyLandmass, x, y) {
  console.log(x, y, emptyLandmass)
  if (emptyLandmass[x][y]) {
    // remove
    return emptyLandmass[x][y];
  } else {

    return recursePositionHorizontal(emptyLandmass, x, y + 1)
  }
}
