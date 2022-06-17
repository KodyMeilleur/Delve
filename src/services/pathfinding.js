
export function findPath(maze, startCoords, endCoords) {
  const mazeClone = maze.map((row) => {
    return row.map((cell) => {
      return {
        density: cell.density,
        // Manhattan Heurestic for cardinals
        heur: Math.abs(startCoords.x - endCoords.x) + Math.abs(startCoords.y - endCoords.y) + cell.mpCost,
        g: 0,
        f: 0,
        visited: false,
        parent: null,
        x: cell.x,
        y: cell.y,
        structure: cell.structure ? true: false,
      }
    })
  })
  let openList = [];
  const finalPath = [];
  // const startCell = mazeClone[startCoords.x][startCoords.y];
  const startCell = mazeClone.flat().filter((cell) => {
    return (cell.x == startCoords.x) && (cell.y == startCoords.y)
  })[0];
  // add startCell to openList
  startCell.visited = true;
  openList.push(startCell);
  const gridAdjustmentX = startCoords.x - startCoords.movement < 0 ? 0 : startCoords.x - startCoords.movement;
  const gridAdjustmentY = startCoords.y - startCoords.movement < 0 ? 0 : startCoords.y - startCoords.movement;

  function cardinalCellCheck(cell) {
      // check all directions for cells
      if (cell.x === endCoords.x && cell.y === endCoords.y) {
        openList = [];
        return cell;
      }
      // north
      if ((cell.x - gridAdjustmentX) - 1 >= 0) {
        const northCell = mazeClone[(cell.x - gridAdjustmentX) - 1][(cell.y - gridAdjustmentY)];
        if (northCell && northCell.density === 0 && northCell.visited === false) {
          northCell.g = Math.abs(northCell.x - endCoords.x) + Math.abs(northCell.y - endCoords.y);
          northCell.f = northCell.g + northCell.heur;
          northCell.visited = true;
          northCell.parent = cell;
          openList.push(northCell);
        }
      }
      // east
      if ((cell.y - gridAdjustmentY) + 1 < mazeClone[0].length) {
        const eastCell = mazeClone[(cell.x - gridAdjustmentX)][(cell.y - gridAdjustmentY) + 1];
        if (eastCell && eastCell.density === 0 && eastCell.visited === false) {
          eastCell.g = Math.abs(eastCell.x - endCoords.x) + Math.abs(eastCell.y - endCoords.y);
          eastCell.f = eastCell.g + eastCell.heur;
          eastCell.visited = true;
          eastCell.parent = cell;
          openList.push(eastCell);
        }
      } // south
      if ((cell.x - gridAdjustmentX) + 1 < mazeClone.length) {
        const southCell = mazeClone[(cell.x - gridAdjustmentX) + 1][(cell.y - gridAdjustmentY)];
        if (southCell && southCell.density === 0 && southCell.visited === false) {
          southCell.g = Math.abs(southCell.x - endCoords.x) + Math.abs(southCell.y - endCoords.y);
          southCell.f = southCell.g + southCell.heur;
          southCell.visited = true;
          southCell.parent = cell;
          openList.push(southCell);
        }
      } // west
      if ((cell.y - gridAdjustmentY) - 1 >= 0) {
        const westCell = mazeClone[(cell.x - gridAdjustmentX)][(cell.y - gridAdjustmentY) - 1];
        if (westCell && westCell.density === 0 && westCell.visited === false) {
          westCell.g = Math.abs(westCell.x - endCoords.x) + Math.abs(westCell.y - endCoords.y);
          westCell.f = westCell.g + westCell.heur;
          westCell.visited = true;
          westCell.parent = cell;
          openList.push(westCell);
        }
      }

      return false;
    }

    while(openList.length > 0) {

      const currentCell = openList.reduce((previousValue, currentValue) => {
        return previousValue.f < currentValue.f ? previousValue : currentValue;
      })

      openList.splice(openList.indexOf(currentCell), 1)

      const isFinished = cardinalCellCheck(currentCell);
      if (isFinished) {
        finalPath.push(isFinished);
        const getParent = function (cell) {
          if (cell.parent) {
            finalPath.push(cell.parent);
            getParent(cell.parent);
          } else {
            return true;
          }
        }
        getParent(isFinished);
      }
    }

    return finalPath.reverse().slice(1);
}

export function returnShallowMapChunk(startEntity, fullMap, isBattling) {
  const rowColumnSize = (startEntity.movement * 2);
  const entityX = isBattling ? startEntity.battleX : startEntity.x;
  const entityY = isBattling ? startEntity.battleY : startEntity.y;
  const startX = (entityX - startEntity.movement) < 0 ? 0 : (entityX - startEntity.movement);
  const startY = (entityY - startEntity.movement) < 0 ? 0 : (entityY - startEntity.movement);

  const mazeClone = [];

  for (let i= 0; i <= rowColumnSize; i++) {
    const row = [];
    for (let k= 0; k <= rowColumnSize; k++) {
      if (fullMap[startX + i]) {
        if (startY + k < fullMap[startX + i].length) {
          const currentCellPointer = fullMap[startX + i][startY + k];
          const shallowCell = {
            density: currentCellPointer.density || currentCellPointer.monsters.length,
            visited: false,
            parent: null,
            x: currentCellPointer.x,
            y: currentCellPointer.y,
            g: null,
            f: null,
            heur: null,
            mpCost: (currentCellPointer.structure && currentCellPointer.structure.mpCost) || 1,
            structure: currentCellPointer.structure ? true : false,
          }
          row.push(shallowCell);
        }
      }
    }
    if (row.length) {
      mazeClone.push(row);
    }
  }

  return mazeClone;
}

export function toggleMoveTiles(startEntity, map, isBattling) {
  const tilesToCheck = [];
  const entityX = isBattling ? startEntity.battleX : startEntity.x;
  const entityY = isBattling ? startEntity.battleY : startEntity.y;
  const startX = parseInt(entityX);
  const startY = parseInt(entityY);
  let totalMP = startEntity.movement;
  const gridAdjustmentX = startX - totalMP < 0 ? 0 : startX - totalMP;
  const gridAdjustmentY = startY - totalMP < 0 ? 0 : startY - totalMP;

  function cardinalCellCheck(cell, lastMPCost) {

      // north
      if ((cell.x - gridAdjustmentX) - 1 >= 0) {
        const northCell = map[(cell.x - gridAdjustmentX) - 1][(cell.y - gridAdjustmentY)];
        const mpRange = (lastMPCost + northCell.mpCost) <= totalMP;
        if (northCell && northCell.density === 0 && mpRange) {
          if ((northCell.x === startCell.x && northCell.y === startCell.y) === false) {
            tilesToCheck.push(northCell);
            cardinalCellCheck(northCell, lastMPCost + northCell.mpCost);
          }
        }
      }
      // east
      if ((cell.y - gridAdjustmentY) + 1 < map[0].length) {
        const eastCell = map[(cell.x - gridAdjustmentX)][(cell.y - gridAdjustmentY) + 1];
        const mpRange = (lastMPCost + eastCell.mpCost) <= totalMP;
        if (eastCell && eastCell.density === 0 && mpRange) {
          if ((eastCell.x === startCell.x && eastCell.y === startCell.y) === false) {
            tilesToCheck.push(eastCell);
            cardinalCellCheck(eastCell, lastMPCost + eastCell.mpCost);
          }
        }
      } // south
      if ((cell.x - gridAdjustmentX) + 1 < map.length) {
        const southCell = map[(cell.x - gridAdjustmentX) + 1][(cell.y - gridAdjustmentY)];
        const mpRange = (lastMPCost + southCell.mpCost) <= totalMP;
        if (southCell && southCell.density === 0 && mpRange) {
          if ((southCell.x === startCell.x && southCell.y === startCell.y) === false) {
            tilesToCheck.push(southCell);
            cardinalCellCheck(southCell, lastMPCost + southCell.mpCost);
          }
        }
      } // west
      if ((cell.y - gridAdjustmentY) - 1 >= 0) {
        const westCell = map[(cell.x - gridAdjustmentX)][(cell.y - gridAdjustmentY) - 1];
        const mpRange = (lastMPCost + westCell.mpCost) <= totalMP;
        if (westCell && westCell.density === 0 && mpRange) {
          if ((westCell.x === startCell.x && westCell.y === startCell.y) === false) {
            tilesToCheck.push(westCell);
            cardinalCellCheck(westCell, lastMPCost + westCell.mpCost);
          }
        }
      }

      return false;
    }

    const startCell = map[startX - gridAdjustmentX][startY - gridAdjustmentY];

    cardinalCellCheck(startCell, 0);

    return tilesToCheck;
}

export function getEntityDirection(entity) {
    const tileToMoveTo = entity.path && entity.path[0];
    // determine direction to move in
    // 1,2,3,4 for directions, 0 non moving
    // 1N, 2E, 3S, 4W
    // determine number of tiles to move
    // 16px per tick, 1 sec moves a full tile and shows 4 frames?
    if (tileToMoveTo) {
      const moveToX = tileToMoveTo.x;
      const moveToY = tileToMoveTo.y;

      const moveUp = moveToX < entity.x ? 1 : null;
      const moveDown = moveToX > entity.x ? 3 : null;
      const moveRight = moveToY > entity.y ? 2 : null;
      const moveLeft = moveToY < entity.y ? 4 : null;

      const moveDirection = moveUp || moveDown || moveRight || moveLeft;

      return {direction: moveDirection, movingToStructure: tileToMoveTo && tileToMoveTo.structure };
    }

    return {direction: 3, movingToStructure: tileToMoveTo};
}
