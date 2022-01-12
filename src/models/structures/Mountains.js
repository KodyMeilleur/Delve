import { Stone } from '../items/resources/Stone.js';
import { Structure } from '../Structure';

export function Mountains () {
  Structure.call(this);
  this.type = 'Mountains';
  this.sprite = 'assets/Tiles/Plains/Mountains/sheet';
  this.unexploredSprite = 'assets/Tiles/Sections/Status/Unexplored/sheet';
  this.unexploredSpriteIcon = 'assets/Tiles/Sections/Status/Unexplored/icon2';
  this.unexploredFrames = 11;
  this.unexploredDelayFrameMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.hp = 10;
  this.mpCost = 3;
  this.name = 'Red Mountains';

  this.loot = [
    {
      item: Stone,
      chance: 90,
      amount: 3,
    }
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
