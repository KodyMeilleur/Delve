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
  name: 'Melee Attack',
  animation: '1hAttack',
  animationFrames: 4,
  type: NEUTRAL,
  typeTwo: null,
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

export const SculptEarth = {
  name: 'Sculpt Earth',
  animation: 'Cast',
  animationFrames: 5,
  type: GREEN,
  typeTwo: null,
  baseDmg: 'intelligence',
  addedDmg: 'weapon',
  costType: 'mp',
  costSlotOne: 1,
  costSlotTwo: 0,
  range: 3,
  stepType: 'foot',
  anchored: true, // anchored to user
  placementShape: null, // default placement shape is single tile. Placements start at mouselocation - upper left corner
  icon: 'assets/Icons/Skills/Green/sculptEarth.png',
  effectSprite: 'assets/Spells/Green/sculptEarth/sheet.gif',
  effectDelay: 1500,
  nature: 'aggressive',
  takeDominion: false,
  dominionValue: 0,
  dominionType: NEUTRAL
}

export const Reforestation = {
  name: 'Reforestation',
  animation: 'Cast',
  animationFrames: 5,
  type: GREEN,
  typeTwo: null,
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
  turnEffectActive: true, // creates recurring or delayed turn effect
  turnEffect: {
    triggerId: null,
    turnCountdown: 1,
    maxTurnCountdown: 1, // for recurring effects
    recurring: false,
    effectType: 'expansion',
    expansion: { // unique config for expansion types
      traversal: 'cardinal',
      direction: 'random',
      range: 1,
      amountToEffect: 1,
      type: 'dominion',
      color: GREEN,
      value: 1,
    }
  },
  dominionValues: [1],
  dominionType: [GREEN],
}
