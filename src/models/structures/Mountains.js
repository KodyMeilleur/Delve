import { Stone } from '../items/resources/Stone.js';

export function Mountains () {
  this.type = 'Mountains';
  this.sprite = 'assets/Tiles/Plains/Mountains/sheet';
  this.hp = 10;

  this.loot = [
    Stone,
  ];
}

const MountainFormations = [
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

export {MountainFormations};
