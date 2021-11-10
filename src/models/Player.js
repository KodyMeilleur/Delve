import CONST from '../CONST';

export function DefaultPlayer(name, x, y) {
  // LOCATION
  this.x = x;
  this.y = y;

  this.name = name;
  this.isCreature = true;
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


  // this.sprite = '/assets/Tiles/Void/void.png';
  this.density = 1;
  this.width = CONST.tileWidth;
  this.height = CONST.tileHeight;
}

// TODO: Loadfile argument order
export function Player() {

}
