import { v4 as uuidv4 } from 'uuid';
import CONST from '../CONST';

export function Monster(x, y) {

    this.id = uuidv4();
    // LOCATION
    this.x = x;
    this.y = y;
    this.movingVerticalOffset = 0;
    this.movingHorizontalOffset = 0;

    this.isCreature = true;
    this.tilesToTravel = 0;
    this.movingDirection = 0; // 1N, 2E, 3S, 4W,  0 non moving South

    // limit 3 for a monster?
    this.technologies = [];
    this.items = [];

    this.equipment = {
      leftHand: {},
      rightHand: {},
      armor: {},
      helmet: {},
      leftRing: {},
      rightRing: {},
    };

    this.status = {
      psn: 0,
      cur: [],
      brn: 0,
      frz: 0,
      con: 0,
      bnd: 0
    };

    this.density = 1;
    this.width = CONST.tileWidth;
    this.height = CONST.tileHeight;
}
