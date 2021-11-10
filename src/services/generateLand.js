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
    const removalSideSize = orientationHorizontal ? CONST.normalColumnSize : CONST.normalRowSize;

    // index value of where to start removing chunks
    let startRemovalCell = getRandomInt(0, removalSideSize - 1); // Array Position
    const currentBlockLength = orientationHorizontal ? block[0].length : block.length;


    // make sure block chunks arent falling out of bounds of array
    // if horizontal, check startingCell + block[0].length <= CONST.normalColumnSize
    // if vertical, check startingCell + block.length <= CONST.normalRowSize
    // console.log(startRemovalCell, removalSideSize, currentBlockLength, chosenSide);


    if (((startRemovalCell + 1) + currentBlockLength) >= removalSideSize) {

      startRemovalCell = ((removalSideSize - 1) - currentBlockLength);
    }

    const CURRENT_BLOCK_X_LENGTH = block.length;
    const CURRENT_BLOCK_Y_LENGTH = block[0].length;
    // x = ^v y = <>
    for (let blockX = 0; blockX < CURRENT_BLOCK_X_LENGTH; blockX++) {
      for (let blockY = 0; blockY < CURRENT_BLOCK_Y_LENGTH; blockY++) {

          // side // x, y
          // 1 // ((0 + iterationX), (startRemovalCell + iterationY))
          // 2 // ((startRemovalCell + iterationX), ((maxSideRange - currentBlockLength) + iterationY))
          // 3 // ((maxSideRange - iterationX), (startRemovalCell + iterationY))
          // 4 // ((startRemovalCell + iterationX), (0 + iterationY))
        const finalHorX = chosenSide === 1 ? (0 + blockX) : ((maxSideRange - 1) - blockX);
        const finalHorY = (startRemovalCell + blockY);
        const finalVertX = (startRemovalCell + blockX);
        const finalVertY = chosenSide === 4 ? (0 + blockY) : (((CONST.normalColumnSize - 1) - (currentBlockLength - 1)) + blockY);

        const cellToRemove = orientationHorizontal ?
          recursePositionHorizontal(emptyLandmass, chosenSide, finalHorX, finalHorY) :
          recursePositionVertical(emptyLandmass, chosenSide, finalVertX, finalVertY) ;

        emptyLandmass[cellToRemove.x][cellToRemove.y] = new VoidTile(cellToRemove.x, cellToRemove.y);
      }
    }
  })

  return emptyLandmass;
}

export function cleanLandmass (landmass) {
  let validPool = [];
  let invalidPool = [];
  let permPool = [];

  function recursiveCellCheck(cell) {
    if (cell.visited !== true) {
      cell.visited = true;
      if (cell.density === 0) {
        // check all directions for cells
         validPool.push(cell);
        // north
        if (cell.x - 1 >= 0) {
          recursiveCellCheck(landmass[cell.x - 1][cell.y] )
        }
        // east
        if (cell.y + 1 < CONST.normalColumnSize) {
          recursiveCellCheck(landmass[cell.x][cell.y + 1] )
        } // south
        if (cell.x + 1 < CONST.normalRowSize) {
          recursiveCellCheck(landmass[cell.x + 1][cell.y] )
        } // west
        if (cell.y - 1 >= 0) {
          recursiveCellCheck(landmass[cell.x][cell.y - 1] )
        }
      }
    }
  }


  for (let i = 0; i < landmass.length; i++) {
    for (let k = 0; k < landmass[i].length; k++) {

      const currentCell = landmass[i][k];
      if (currentCell.visited !== true) {
        recursiveCellCheck(currentCell);

        // TODO: arbitrary filter on splintered landmass
        if (validPool.length < 18) {
          invalidPool = invalidPool.concat(validPool);
        } else {
          permPool.push(...validPool);
        }
      }
      validPool = [];
    }
  }

  invalidPool.forEach((cell) => {
    const x = cell.x,
    y = cell.y;

    landmass[x][y] = new VoidTile(x, y);

    // TODO: Re-add Tiles that are removed?
  })

}

export function createEmptyLandmass(row, column) {
  const defaultLandArray = [];

  for (let i = 0; i < row; i++) {
    const newRow = [];
     for (let k = 0; k < column; k++) {
       let tile = new VoidTile(i, k);
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

export function recursePositionHorizontal(emptyLandmass, chosenSide, x, y) {

  if (emptyLandmass[x][y]) {
    // return cell to remove
    return emptyLandmass[x][y];
  } else {
    // if chosenSide is 1, look downward i.e addition
    // else 3 look upward by subtracting
    const directionBump = chosenSide === 1 ? (x + 1) : (x - 1);

    return recursePositionHorizontal(emptyLandmass, chosenSide, directionBump, y)
  }
}

export function recursePositionVertical(emptyLandmass, chosenSide, x, y) {
  if (emptyLandmass[x][y]) {
    // return cell to remove
    return emptyLandmass[x][y];
  } else {
    // if chosenSide is 2, look left i.e subtraction
    // else 4 look right by addition
    const directionBump = chosenSide === 2 ? (y - 1) : (y + 1);

    return recursePositionVertical(emptyLandmass, chosenSide, x, directionBump)
  }
}
