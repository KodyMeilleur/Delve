import { v4 as uuidv4 } from 'uuid';
import CONST from '../CONST';

export function Monster(x, y) {

    this.id = uuidv4();
    // LOCATION
    this.x = x;
    this.y = y;
    this.battleX = null;
    this.battleY = null;

    this.isCreature = true;

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
