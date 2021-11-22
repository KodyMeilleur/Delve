import CONST from '../CONST';

export function findPath(maze, startCoords, endCoords) {
  const mazeClone = maze.map((row) => {
    return row.map((cell) => {
      return {
        density: cell.density,
        // Manhattan Heurestic for cardinals
        heur: Math.abs(startCoords.x - endCoords.x) + Math.abs(startCoords.y - endCoords.y),
        g: 0,
        f: 0,
        visited: false,
        parent: null,
        x: cell.x,
        y: cell.y,
      }
    })
  })
  let openList = [];
  const finalPath = [];
  const startCell = mazeClone[startCoords.x][startCoords.y];
  // add startCell to openList
  startCell.visited = true;
  openList.push(startCell);

  function cardinalCellCheck(cell) {
      // check all directions for cells
      if (cell.x === endCoords.x && cell.y === endCoords.y) {
        openList = [];
        return cell;
      }
      // north
      if (cell.x - 1 >= 0) {
        const northCell = mazeClone[cell.x - 1][cell.y];
        if (northCell && northCell.density === 0 && northCell.visited === false) {
          northCell.g = Math.abs(northCell.x - endCoords.x) + Math.abs(northCell.y - endCoords.y);
          northCell.f = northCell.g + northCell.heur;
          northCell.visited = true;
          northCell.parent = cell;
          openList.push(northCell);
        }
      }
      // east
      if (cell.y + 1 < CONST.normalColumnSize) {
        const eastCell = mazeClone[cell.x][cell.y + 1];
        if (eastCell && eastCell.density === 0 && eastCell.visited === false) {
          eastCell.g = Math.abs(eastCell.x - endCoords.x) + Math.abs(eastCell.y - endCoords.y);
          eastCell.f = eastCell.g + eastCell.heur;
          eastCell.visited = true;
          eastCell.parent = cell;
          openList.push(eastCell);
        }
      } // south
      if (cell.x + 1 < CONST.normalRowSize) {
        const southCell = mazeClone[cell.x + 1][cell.y];
        if (southCell && southCell.density === 0 && southCell.visited === false) {
          southCell.g = Math.abs(southCell.x - endCoords.x) + Math.abs(southCell.y - endCoords.y);
          southCell.f = southCell.g + southCell.heur;
          southCell.visited = true;
          southCell.parent = cell;
          openList.push(southCell);
        }
      } // west
      if (cell.y - 1 >= 0) {
        const westCell = mazeClone[cell.x][cell.y - 1];
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

    console.log(finalPath, mazeClone)
    return finalPath;
}
