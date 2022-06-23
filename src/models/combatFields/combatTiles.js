import { v4 as uuidv4 } from 'uuid';
import { getRandomInt } from '../../services/generateLand';
import { TYPES } from './combatFields';

export function ForestTile(x, y) {
  this.id = uuidv4();
  this.x = x;
  this.y = y;
  this.visited = false;
  this.isTile = true;
  this.moveHighlighted = false;
  this.attackHighlighted = false;
  this.players = [];
  this.monsters = [];
  this.structure = null;
  this.animationFrames = 1;
  this.density = 0;

  this.variants = 6;
  this.variant = (getRandomInt(0, this.variants - 1) < 3) ? getRandomInt(0, this.variants - 1) : null;
  this.sprite = `assets/Tiles/Battle/Forest/sheet${this.variant !== null ? this.variant : ''}.png`;

  this.potentialPath = false;
  this.type = [TYPES.NEUTRAL];
  this.name = 'Forest Ground';
  this.mpCost = 1;

  this.battleTile = true;
  this.manaValueSlotOne = 0;
  this.manaTypeSlotOne = 'empty';
  this.manaValueSlotTwo = 0;
  this.manaTypeSlotTwo = 'empty';
  this.manaOwnerId = null;
  this.skillEntity = null; // object with config? function?
}
