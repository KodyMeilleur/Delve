import CONST from '../CONST';

export function VoidTile(x, y) {
  this.x = x;
  this.y = y;
  this.visited = false;
  this.players = [];
  this.structure = null;
  this.enemies = [];
  this.sprite = 'assets/Tiles/Void/void.png';
  this.density = 1;
  this.width = CONST.tileWidth;
  this.height = CONST.tileHeight;
}

export function PlainsTile(x, y) {
  this.x = x;
  this.y = y;
  this.visited = false;
  this.players = [];
  this.structure = null;
  this.enemies = [];
  this.sprite = 'assets/Tiles/Plains/3a.png';
  this.density = 0;
}

export function GenericTile(x, y, spritePath) {
  this.x = x;
  this.y = y;
  this.visited = false;
  this.players = [];
  this.structure = null;
  this.enemies = [];
  this.sprite = spritePath; // ../assets/Tiles/Plains/plains.png
  this.density = 0;
}
