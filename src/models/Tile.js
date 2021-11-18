import CONST from '../CONST';
import { v4 as uuidv4 } from 'uuid';

export function VoidTile(x, y) {
  this.id = uuidv4();
  this.x = x;
  this.y = y;
  this.visited = false;
  this.isTile = true;
  this.moveHighlighted = false;
  this.players = [];
  this.structure = null;
  this.enemies = [];
  this.sprite = 'assets/Tiles/Void/Move/sheet.png';
  this.animationFrames = 2;
  this.density = 1;
  this.width = CONST.tileWidth;
  this.height = CONST.tileHeight;
}

export function PlainsTile(x, y) {
  this.id = uuidv4();
  this.x = x;
  this.y = y;
  this.visited = false;
  this.isTile = true;
  this.moveHighlighted = false;
  this.players = [];
  this.structure = null;
  this.enemies = [];
  this.sprite = 'assets/Tiles/Plains/Move/sheet.png';
  this.animationFrames = 9;
  this.density = 0;
}

export function GenericTile(x, y, spritePath) {
  this.id = uuidv4();
  this.x = x;
  this.y = y;
  this.visited = false;
  this.isTile = true;
  this.moveHighlighted = false;
  this.players = [];
  this.structure = null;
  this.enemies = [];
  this.sprite = spritePath; // ../assets/Tiles/Plains/plains.png
  this.density = 0;
}
