import CONST from '../CONST';
import { v4 as uuidv4 } from 'uuid';
import { getRandomInt } from '../services/generateLand';
// import { Event } from './Event';

export function VoidTile(x, y) {
  this.id = uuidv4();
  this.x = x;
  this.y = y;
  this.visited = false;
  this.isTile = true;
  this.moveHighlighted = false;
  this.players = [];
  this.monsters = [];
  this.structure = null;
  this.enemies = [];
  this.variants = 1;
  this.sprite = 'assets/Tiles/Void/Move/sheet.png';
  this.animationFrames = 2;
  this.density = 1;
  this.width = CONST.tileWidth;
  this.height = CONST.tileHeight;
  this.event = null;
  this.potentialPath = false;
  this.type = 'Void';
  this.mpCost = 100;
}

export function PlainsTile(x, y) {
  this.id = uuidv4();
  this.x = x;
  this.y = y;
  this.visited = false;
  this.isTile = true;
  this.moveHighlighted = false;
  this.players = [];
  this.monsters = [];
  this.structure = null;
  // this.structure = (getRandomInt(0, 3) === 2) ? { type: 'Woods', path: 'assets/Tiles/Plains/Woods/sheet.png'} : null;
  this.enemies = [];
  this.animationFrames = 9;
  this.density = 0;
  this.event = null;
  // this.event = (this.structure === null && (getRandomInt(0, 3) === 2)) ? new Event('Alert') : null;
  this.variants = 5;
  this.variant = (getRandomInt(0, this.variants - 1) === 1) ? getRandomInt(0, this.variants - 1) : null;
  this.sprite = `assets/Tiles/Plains/Platform/sheet${this.variant !== null ? this.variant : ''}.png`;
  this.potentialPath = false;
  this.type = 'Plains';
  this.mpCost = 1;
}

export function GenericTile(x, y, spritePath) {
  this.id = uuidv4();
  this.x = x;
  this.y = y;
  this.visited = false;
  this.isTile = true;
  this.moveHighlighted = false;
  this.players = [];
  this.monsters = [];
  this.structure = null;
  this.enemies = [];
  this.sprite = spritePath;
  this.density = 0;
  this.event = null;
  this.potentialPath = false;
  this.type = 'Generic';
  this.mpCost = 1;
}
