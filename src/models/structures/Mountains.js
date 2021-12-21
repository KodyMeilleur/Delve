import { Stone } from '../items/resources/Stone.js';
import { Structure } from '../Structure';

export function Mountains () {
  Structure.call(this);
  this.type = 'Mountains';
  this.sprite = 'assets/Tiles/Plains/Mountains/sheet';
  this.unexploredSprite = 'assets/Tiles/Sections/Status/Unexplored/sheet';
  this.unexploredSpriteIcon = 'assets/Tiles/Sections/Status/Unexplored/icon2';
  this.unexploredFrames = 10;
  this.unexploredDelayFrameMap = [2, 4, 6];
  this.hp = 10;
  this.mpCost = 3;

  this.loot = [
    new Stone(3),
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

export {MountainFormations};
