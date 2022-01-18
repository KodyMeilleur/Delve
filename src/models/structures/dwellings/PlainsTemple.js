import { HalfHeal, FullHeal } from '../../Services.js';
import { Stone } from '../../items/resources/Stone.js';

const STONE = new Stone(1);

export const PlainsTemple = {
  currentTier: 1,
  tierMap: {
    1: 'firstTier',
    2: 'secondTier',
    3: 'thirdTier',
  },
  type: 'Temple',
  avatar: 'assets/portraits/merchant.png',
  lines: [
    "Archon's blessings upon yee.. *cough*",
    "Care to join us in prayer?"
  ],
  buyLines: [
    "Archon's blessings upon yee.",
    "Ah, another child of the light..",
  ],
  denyLines: [
    "Even Archon is in need of coin when traveling.."
  ],
  firstTier: {
    name: "Temple",
    table: [
      {
        service: HalfHeal,
        cost: Math.round(HalfHeal.averageCost * 1.5),
      },
      {
        service: FullHeal,
        cost: Math.round(FullHeal.averageCost * 1.5),
      }
    ],
    cost: null,
  },
  secondTier: {
    name: "Monastary",
    table: [],
    cost: [
      {
        item: STONE,
        quantity: 50
      },
    ]
  },
  thirdTier: {
    name: "Cathedral",
    table: [],
    cost: [
      {
        item: STONE,
        quantity: 100
      },
    ]
  },
}
