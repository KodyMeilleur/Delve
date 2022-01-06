import { VoidTile, PlainsTile } from '../models/Tile';
import { Woods, WoodFormations } from '../models/structures/Woods';
import { Mountains, MountainFormations } from '../models/structures/Mountains';
import { PlainsCity } from '../models/structures/PlainsCity';
import { Totem } from '../models/totems/Totem';

import CONST from '../CONST';


export function refineLandmass() {
  // 12 x 16 (192 Tiles)
  let blankLandmass = createFilledLandmass(CONST.normalRowSize, CONST.normalColumnSize, PlainsTile);
  // create pool of removal blocks, (80 tiles)
  const blocksX = [
    createEmptyLandmass(1, 6), //md
    createEmptyLandmass(2, 3), //md
    createEmptyLandmass(2, 2), //sm
    createEmptyLandmass(2, 2), //sm
    createEmptyLandmass(2, 2), //sm
    createEmptyLandmass(2, 2), //sm
    createEmptyLandmass(1, 2), //sm
    createEmptyLandmass(1, 2), //sm
    createEmptyLandmass(1, 2), //sm
    createEmptyLandmass(1, 1), //sm
    createEmptyLandmass(1, 1), //sm
    createEmptyLandmass(1, 1), //sm
    createEmptyLandmass(1, 1), //sm
    createEmptyLandmass(1, 1), //sm
    createEmptyLandmass(1, 1), //sm
  ];
  const blocksY = [
    createEmptyLandmass(6, 1), //md
    createEmptyLandmass(6, 1), //md
    createEmptyLandmass(3, 2), //md 24
    createEmptyLandmass(2, 2), //sm
    createEmptyLandmass(2, 2), //sm
    createEmptyLandmass(2, 2), //sm
    createEmptyLandmass(2, 2), //sm 32
    createEmptyLandmass(1, 2), //sm
    createEmptyLandmass(1, 2), //sm
    createEmptyLandmass(1, 2), //sm 12
    createEmptyLandmass(1, 1), //sm
    createEmptyLandmass(1, 1), //sm
    createEmptyLandmass(1, 1), //sm
    createEmptyLandmass(1, 1), //sm
    createEmptyLandmass(1, 1), //sm
    createEmptyLandmass(1, 1), //sm 12
  ]

  //        1
  //     ________
  // 4  |       |  2
  //    --------
  //        3
  const SidePoolX = [1, 3];
  const SidePoolY = [2, 4];

  const blockPool = [
    {
      blocks: blocksX,
      sidePool: SidePoolX,
    },
    {
      blocks: blocksY,
      sidePool: SidePoolY,
    },
  ]

  let chosenSide = null;
  blockPool.forEach((pool) => {
    pool.blocks.forEach((block) => {

      let chosenIndex = getRandomInt(0, pool.sidePool.length - 1);
      // push back previously chosen side only after a new side is picked
      if (chosenSide) {
        pool.sidePool.push(chosenSide)
      }
      chosenSide = pool.sidePool.splice(chosenIndex, 1)[0];
      const orientationHorizontal = (chosenSide === 1 || chosenSide === 3);

      const maxSideRange = orientationHorizontal ? CONST.normalRowSize : CONST.normalColumnSize;
      const removalSideSize = orientationHorizontal ? (CONST.normalColumnSize - 1) : (CONST.normalRowSize - 1);

      // index value of where to start removing chunks
      let startRemovalCell = getRandomInt(0, removalSideSize); // Array Position
      const currentBlockLength = orientationHorizontal ? block[0].length : block.length;

      // make sure block chunks arent falling out of bounds of array
      // if horizontal, check startingCell + block[0].length <= CONST.normalColumnSize
      // if vertical, check startingCell + block.length <= CONST.normalRowSize

      if ((startRemovalCell + (currentBlockLength)) > removalSideSize) {
        startRemovalCell = (removalSideSize) - currentBlockLength;
      }

      const CURRENT_BLOCK_ROWS = block.length;
      const CURRENT_BLOCK_COLUMNS = block[0].length;
      // x = ^v y = <>

      for (let blockX = 0; blockX < CURRENT_BLOCK_ROWS; blockX++) {
        for (let blockY = 0; blockY < CURRENT_BLOCK_COLUMNS; blockY++) {

          const finalHorX = chosenSide === 1 ? (0 + blockX) : ((maxSideRange - 1) - blockX);
          const finalHorY = (startRemovalCell + blockY);
          const finalVertX = (startRemovalCell + blockX);
          const finalVertY = chosenSide === 4 ? (0 + blockY) : ((maxSideRange - 1) - blockY);

          const cellToRemove = orientationHorizontal ?
            recursePositionHorizontal(blankLandmass, chosenSide, finalHorX, finalHorY) :
            recursePositionVertical(blankLandmass, chosenSide, finalVertX, finalVertY) ;

          blankLandmass[cellToRemove.x][cellToRemove.y] = new VoidTile(cellToRemove.x, cellToRemove.y);
        }
      }
    })
    chosenSide = null;
  })

  return blankLandmass;
}

export function placeResourceStructures (landmass, type, formationCount) {
  let tries = CONST.continentResourceStructurePlacementAttempts;
  const rowLength = landmass[0].length - 1;
  const columnLength = landmass.length - 1;

  while (tries && formationCount) {
    const randomX = getRandomInt(0, columnLength - 1);
    const randomY = getRandomInt(0, rowLength - 1);
    const seedCell = landmass[randomX][randomY];

    if (seedCell.density === 0 && seedCell.structure === null) {
      const placementZoneObstructed = checkObstructionZoneTopLeft(landmass, randomX, randomY);

      if (placementZoneObstructed === false) {
        placeZone(landmass, seedCell, type);
        formationCount--;
      }
    }
    // pick a random cell
    // check each of 4 orientations to place 3x3 resource formation
    tries--;
  }
}

// Cell starts at top left, checks next 3 cells right for 3 rows down
function checkObstructionZoneTopLeft (landmass, x, y) {
  let obstruction = false;
  let obstructed = false;

  for (let i = 0; i < 3; i++) {
    const tileRow = landmass[x + i] && landmass[x + i].slice(y, y + 3);

    if (!tileRow) {
      obstructed = true;
    } else {
      obstruction = tileRow.find(cell => cell.structure !== null || cell.type === 'Void') || false;
      if (obstruction || tileRow.length < 3) {
        obstructed = true;
      }
    }

  }

  return obstructed;
}

// Cell starts at middle, checks center 3 cells top, center, and lower rows
function checkObstructionZoneMiddle (landmass, x, y) {
  let obstruction = false;
  let obstructed = false;

  for (let i = -1; i < 2; i++) {
    const tileRow = landmass[x + i] && landmass[x + i].slice(y - 1, y + 2);
    if (!tileRow) {
      obstructed = true;
    } else {
      obstruction = tileRow.find(cell => cell.structure !== null || cell.type === 'Void') || false;
      if (obstruction || tileRow.length < 3) {
        obstructed = true;
      }
    }

  }

  return obstructed;
}

// Cell starts at middle, checks center 3 cells top, center, and lower rows
export function listOfEmptyNearTiles (landmass, x, y) {
  let freeTiles = [];

  for (let i = -1; i < 2; i++) {
    const tileRow = landmass[x + i] && landmass[x + i].slice(y - 1, y + 2);
    if (tileRow) {
      tileRow.forEach((cell) => {
        if (cell.structure === null && cell.type !== 'Void') {
          freeTiles.push(cell);
        }
      })
    }
  }

  return freeTiles;
}

function placeZone (landmass, seedCell, type) {
  const structureTypes = {
    'Woods': {structure: Woods, formations: WoodFormations},
    'Mountains': {structure: Mountains, formations: MountainFormations},
  };
  const formation = structureTypes[type].formations[getRandomInt(0, structureTypes[type].formations.length - 1)];

  // console.log(seedCell, type, formation);

  for(let i = 0; i < 3; i++) {
    for(let k = 0; k < 3; k++) {
      const currentCell = landmass[seedCell.x + i][seedCell.y + k];
      if (formation[i][k]) {
        const struct = new structureTypes[type].structure();
        currentCell.structure = struct;
        currentCell.mpCost = currentCell.structure.mpCost;
        currentCell.sprite = `assets/Tiles/Plains/Platform/sheet.png`;
      }
    }
  }

}

export function placeAnchor (landmass) {
  const xCenter = (landmass.length / 2);
  const xRangeLower = xCenter - 3;
  const xRangeUpper = xCenter + 3;

  const yCenter = (landmass[0].length / 2);
  const yRangeLower = yCenter - 4;
  const yRangeUpper = yCenter + 4;
  let TRIES = CONST.continentResourceStructurePlacementAttempts;

  function findAnchorZone() {
    const anchorX = getRandomInt(xRangeLower, xRangeUpper);
    const anchorY = getRandomInt(yRangeLower, yRangeUpper);

    const potentialAnchor = landmass[anchorX][anchorY];
    if (potentialAnchor.type !== 'Void' || potentialAnchor.structure === null) {
      const placementZoneObstructed = checkObstructionZoneMiddle(landmass, anchorX, anchorY);
      if (placementZoneObstructed === false) {
        return potentialAnchor;
      } else {
        TRIES--;
        if (TRIES)
          return findAnchorZone();
      }
    }

      return findAnchorZone();
  }

  const anchorZone = findAnchorZone();

  anchorZone.structure = new PlainsCity();
  anchorZone.mpCost = anchorZone.structure.mpCost;
  anchorZone.sprite = `assets/Tiles/Plains/Platform/sheet.png`;
}

export function placeTotems (landmass, count) {
  //        1
  //     ________
  // 4  |       |  2
  //    --------
  //        3
  const SidePool = [1, 2, 3, 4];
  let findAnchorZone;
  while (count) {
    let chosenIndex = getRandomInt(0, SidePool.length - 1);
    let chosenSide = SidePool.splice(chosenIndex, 1)[0];
    let xCenter;
    let xRangeLower;
    let xRangeUpper;
    let yCenter;
    let yRangeLower;
    let yRangeUpper;

    findAnchorZone = function() {
      const anchorX = getRandomInt(xRangeLower, xRangeUpper);
      const anchorY = getRandomInt(yRangeLower, yRangeUpper);

      const potentialAnchor = landmass[anchorX][anchorY];
      if (potentialAnchor.type !== 'Void' && potentialAnchor.structure === null) {
        return potentialAnchor;
      }

        return findAnchorZone();
    }
    if (chosenSide === 1 || chosenSide === 3) {
      xCenter = chosenSide === 1 ? 2 : landmass.length - 3;
      xRangeLower = xCenter - 2;
      xRangeUpper = xCenter + 1;

      yCenter = chosenSide === 1 ? 2 : landmass[0].length - 3;
      yRangeLower = yCenter - 2;
      yRangeUpper = yCenter + 2;
      const anchorZone = findAnchorZone();

      anchorZone.structure = new Totem();
      anchorZone.mpCost = anchorZone.structure.mpCost;
      anchorZone.sprite = `assets/Tiles/Plains/Platform/sheet.png`;
    }

    if (chosenSide === 2 || chosenSide === 4) {
      xCenter = (landmass.length / 2);
      xRangeLower = xCenter - 3;
      xRangeUpper = xCenter + 3;

      yCenter = chosenSide === 4 ? 2 : landmass[0].length - 3;
      yRangeLower = yCenter - 2;
      yRangeUpper = yCenter + 2;
      const anchorZone = findAnchorZone();

      anchorZone.structure = new Totem();
      anchorZone.mpCost = anchorZone.structure.mpCost;
      anchorZone.sprite = `assets/Tiles/Plains/Platform/sheet.png`;
    }

    count--;
  }
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
      } else {
        invalidPool.push(cell)
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
