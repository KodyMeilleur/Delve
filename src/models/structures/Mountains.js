import { Stone } from '../items/resources/Stone.js';
import { Structure } from '../Structure';
import { Coin } from '../items/Coin.js';

export function Mountains () {
  Structure.call(this);
  this.type = 'Mountains';
  this.sprite = 'assets/Tiles/Outworld/Plains/Mountains/sheet';
  this.demolishedSprite = 'assets/Tiles/Outworld/Plains/Woods/demoSheet';
  this.unexploredSprite = 'assets/Tiles/Outworld/Sections/Status/Unexplored/sheet';
  this.unexploredSpriteIcon = 'assets/Tiles/Outworld/Sections/Status/Unexplored/icon2';
  this.unexploredFrames = 11;
  this.unexploredDelayFrameMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.hp = 10;
  this.mpCost = 3;
  this.name = 'Red Mountains';
  this.category = 'Wild';

  this.loot = [
    {
      item: Stone,
      chance: 90,
      amount: 3,
    },
    {
      item: Coin,
      chance: 15,
      amount: 15,
    },
  ];

  this.demolishLoot = [
    {
      item: Stone,
      chance: 100,
      amount: 15,
    },
    {
      item: Coin,
      chance: 90,
      amount: 100,
    },
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
