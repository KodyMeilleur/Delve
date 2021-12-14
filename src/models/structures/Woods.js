import { Wood } from '../items/resources/Wood.js';

export function Woods () {
  this.type = 'Woods';
  this.sprite = 'assets/Tiles/Plains/Woods/sheet';
  this.hp = 3;
  this.mpCost = 2;

  this.loot = [
    new Wood(1),
  ];
}

const WoodFormations = [
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
    [1, 1, 1],
  ],
];

export {WoodFormations};
