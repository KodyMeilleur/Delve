import { Wood } from '../items/resources/Wood.js';
import { Coin } from '../items/Coin.js';
import { Structure } from '../Structure';

export function Woods () {
  Structure.call(this);
  this.type = 'Woods';
  this.sprite = 'assets/Tiles/Plains/Woods/sheet';
  this.demolishedSprite = 'assets/Tiles/Plains/Woods/demoSheet';
  this.unexploredSprite = 'assets/Tiles/Sections/Status/Unexplored/sheet';
  this.unexploredSpriteIcon = 'assets/Tiles/Sections/Status/Unexplored/icon2';
  this.unexploredFrames = 11;
  this.unexploredDelayFrameMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  this.hp = 3;
  this.mpCost = 2;
  this.name = 'Woods';
  this.category = 'Wild';

  this.loot = [
    {
      item: Wood,
      chance: 90,
      amount: 3,
    },
    {
      item: Coin,
      chance: 25,
      amount: 5,
    },
  ];

  this.demolishLoot = [
    {
      item: Wood,
      chance: 100,
      amount: 15,
    },
    {
      item: Coin,
      chance: 75,
      amount: 30,
    },
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
