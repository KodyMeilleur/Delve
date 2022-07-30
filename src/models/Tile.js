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
  this.sprite = 'assets/Tiles/Outworld/Void/Move/sheet.png';
  this.animationFrames = 2;
  this.density = 1;
  this.width = CONST.tileWidth;
  this.height = CONST.tileHeight;
  this.event = null;
  this.potentialPath = false;
  this.type = 'Void';
  this.name = 'Void';
  this.mpCost = 100;
  this.tier = 1;
  this.battleTile = false;
  this.NORTHPATH = false;
  this.WESTPATH = false;
  this.SOUTHPATH = false;
  this.EASTPATH = false;
  this.itemCharged = false;
  this.moneycharged = false;
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
  this.enemies = [];
  this.animationFrames = 7;
  this.density = 0;
  this.event = null;
  this.variants = 9;
  this.variant = (getRandomInt(0, this.variants - 1) < 3) ? getRandomInt(0, this.variants - 1) : null;
  this.sprite = `assets/Tiles/Outworld/Plains/Platform/sheet${this.variant !== null ? this.variant : ''}.png`;
  this.potentialPath = false;
  this.type = 'Plains';
  this.name = 'Plains';
  this.mpCost = 1;
  this.tier = 1;
  this.battleTile = false;
  this.NORTHPATH = true;
  this.WESTPATH = true;
  this.SOUTHPATH = true;
  this.EASTPATH = true;
  this.itemCharged = false;
  this.moneycharged = false;
  this.pathType = 'Paths1';
  if (this.variant === 4 || this.variant === 5) {
    this.pathType = 'Paths2';
  }
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
  this.name = 'Generic';
  this.mpCost = 1;
  this.tier = 1;
  this.battleTile = false;
  this.NORTHPATH = false;
  this.WESTPATH = false;
  this.SOUTHPATH = false;
  this.EASTPATH = false;
  this.itemCharged = false;
  this.moneycharged = false;
}
