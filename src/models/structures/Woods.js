import { Wood } from '../items/resources/Wood.js';
import { Structure } from '../Structure';

export function Woods () {
  Structure.call(this);
  this.type = 'Woods';
  this.sprite = 'assets/Tiles/Plains/Woods/sheet';
  this.unexploredSprite = 'assets/Tiles/Sections/Status/Unexplored/sheet';
  this.unexploredSpriteIcon = 'assets/Tiles/Sections/Status/Unexplored/icon2';
  this.unexploredFrames = 6;
  this.unexploredDelayFrameMap = [0, 1, 2, 3, 4, 5, 6];
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
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 0, 0],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [0, 0, 1],
    [0, 1, 0],
  ],
];

export {WoodFormations};
