import CONST from '../CONST';
import { v4 as uuidv4 } from 'uuid';
import { Animation } from './Animation.js';
import { MeleeAttack, Reforestation, SculptEarth, Thunder } from './Skills.js';
// import TYPES from './combatFields/combatTiles.js';

export function DefaultPlayer(name, x, y) {

  this.id = uuidv4();
  // LOCATION
  this.x = x;
  this.y = y;
  this.battleX = 0;
  this.battleY = 0;
  this.isBattling = false;
  this.roundFinished = false;
  this.isDead = false;

  // TODO: Move to vue component only
  this.movingVerticalOffset = 0;
  this.movingHorizontalOffset = 0;
  this.tilesToTravel = 0;
  this.movingDirection = 0; // 1N, 2E, 3S, 4W,  0 non moving South
  this.path = null;
  this.outworldTileOccupied = {};
  this.inworldTileOccupied = {};

  this.occupiedSprite = 'assets/Tiles/Outworld/Sections/Status/Player/marker';
  this.sprite = 'assets/Characters/Human/';
  this.animation = new Animation(4, 'Idle', true);
  this.defaultAnimation = this.animation;

  this.name = name;
  this.isCreature = true;
  this.isPlayer = true;
  this.xp = 0;
  this.level = 1;

  this.maxMovement = 3; // moving points
  this.movement = 3; // moving points

  this.heldMana = {
    'RED': 0,
    'BLUE': 0,
    'GREEN': 0,
    'WHITE': 0,
    'BLACK': 0,
    'PURPLE': 0,
    'NEUTRAL': 0
  }

  // STATS
  this.hp = CONST.defaultHP;
  this.maxHp = CONST.defaultHP;
  this.might = CONST.defaultStartingStat;
  this.toughness = CONST.defaultStartingStat;
  this.intelligence = CONST.defaultStartingStat;
  this.arcana = CONST.defaultStartingStat;

  // DEVOTION POINTS ARE FOR DEFAULT HELD MANA, GRANTED EVERY X LEVEL
  this.devotionPool = 0;
  this.devotion = {
    'RED': 0,
    'BLUE': 0,
    'GREEN': 5,
    'WHITE': 0,
    'BLACK': 10,
    'PURPLE': 0,
    'NEUTRAL': 0
  };

  this.discipline = 'GREEN';

  this.pts = CONST.startingStatPoints;
  this.coin = 100;

  this.technologies = [];
  this.items = [];
  this.inShop = false;

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

  // SKILLS SECTION
  this.ap = 1;
  this.maxAp = 1;

  this.skills = {
    'NEUTRAL': [
      MeleeAttack,
    ],
    'GREEN': [
      Reforestation,
      SculptEarth
    ],
    'BLUE': [
      Thunder
    ]
  };

  this.equippedSkills = [
    MeleeAttack,
    Reforestation,
    SculptEarth,
    Thunder
  ];

  this.density = 1;
  this.width = CONST.tileWidth;
  this.height = CONST.tileHeight;
}
