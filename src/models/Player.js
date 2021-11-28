import CONST from '../CONST';
import { v4 as uuidv4 } from 'uuid';
import { Animation } from './Animation.js';

export function DefaultPlayer(name, x, y) {

  this.id = uuidv4();
  // LOCATION
  this.x = x;
  this.y = y;
  this.movingVerticalOffset = 0;
  this.movingHorizontalOffset = 0;
  this.sprite = 'assets/Characters/Human/';
  this.animation = new Animation(9, 'Idle', true);
  this.defaultAnimation = this.animation;

  this.name = name;
  this.isCreature = true;
  this.tilesToTravel = 0;
  this.movingDirection = 0; // 1N, 2E, 3S, 4W,  0 non moving South
  this.mp = 3; // moving points
  // STATS
  this.hp = CONST.defaultHP;
  this.en = CONST.defaultEN;
  this.str = CONST.defaultStartingStat;
  this.def = CONST.defaultStartingStat;
  this.int = CONST.defaultStartingStat;
  this.wis = CONST.defaultStartingStat;
  this.pts = CONST.startingStatPoints;

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

export function Player() {

}
