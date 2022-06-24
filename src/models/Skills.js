import { RED, BLUE, GREEN, BLACK, WHITE, PURPLE } from './combatFields/combatFields';

const NEUTRAL = 'NEUTRAL';

export function Skill() {
  this.type = NEUTRAL;
  this.costType = 'AP'; // MP
  this.costSlotOne = 0;
  this.costSlotTwo = 0;
  this.costColorSlotOne = null;
  this.costColorSlotTwo = null;
  this.icon = '';
  this.range = 0;
  this.anchored = false;
  this.nature = 'defensive'; // aggressive, placement
  // stepType: 'walk', used for pathing algorithm potential effected tiles. walk uses mp/range cardinally. crow includes diagonal
}

export const SKILL_TYPES = {
  NEUTRAL,
  RED,
  BLUE,
  GREEN,
  WHITE,
  BLACK,
  PURPLE
}

export const MeleeAttack = {
  type: NEUTRAL,
  baseDmg: 'might',
  addedDmg: 'weapon',
  costType: 'ap',
  costSlotOne: 1,
  costSlotTwo: 0,
  range: 1,
  stepType: 'foot',
  anchored: true, // anchored to user
  placementShape: null, // default placement shape is single tile. Placements start at mouselocation - upper left corner
  icon: 'assets/Icons/Skills/Neutral/meleeAttack.png',
  nature: 'aggressive',
  takeDominion: false,
  dominionValue: 0,
  dominionType: NEUTRAL
}

export const Reforestation = {
  type: GREEN,
  baseDmg: '',
  addedDmg: '',
  costType: 'mp',
  costSlotOne: 2,
  costSlotTwo: 0,
  range: 2,
  stepType: 'crow',
  anchored: true,
  placementShape: null,
  icon: 'assets/Icons/Skills/Green/reforestation.png',
  nature: 'placement',
  takeDominion: true,
  dominionValues: [1],
  dominionType: [GREEN],
  skillEntity: {
    immediateEffect: false,
    lingeringEffect: true,
    turnsToActivate: 1,
    effectType: 'tileCharge', // Summon, Dominion, etc
    dominionValue: 1,
    dominionType: GREEN,
    stepType: 'crow',
    range: 1,
    tilesToEffect: 'all' // all, random, or number array representing effected tiles
  }
}
