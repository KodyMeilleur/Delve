import { DilutedHealthPotion, DilutedEnergyPotion } from '../../items/consumables/Potions.js';
import { MagicBean } from '../../items/nurture/MagicBean.js';
import { Wood } from '../../items/resources/Wood.js';
import { Stone } from '../../items/resources/Stone.js';

const DILUTEDHEALTHPOTION = new DilutedHealthPotion(1);
const DILUTEDENERGYPOTION = new DilutedEnergyPotion(1);
const MAGICBEAN = new MagicBean(1);
const WOOD = new Wood(1);
const STONE = new Stone(1);

export const PlainsShop = {
  currentTier: 1,
  tierMap: {
    1: 'firstTier',
    2: 'secondTier',
    3: 'thirdTier',
  },
  type: 'Shop',
  avatar: 'assets/portraits/merchant.png',
  lines: [
    "Hail stranger. More travelers coming through than usual! What can I get for you?",
    "Only the cheapest and most reliable wares for your consideration, sir!"
  ],
  buyLines: [
    "Excellent selection!",
  ],
  sellLines: [
    "I'll take that off your hands..",
  ],
  denyLines: [
    "Deepest Apologies, it seems you havent the coin for that."
  ],
  firstTier: {
    name: "Market",
    table: [
      {
        item: DILUTEDHEALTHPOTION,
        cost: DILUTEDHEALTHPOTION.averageCost * 1.5,
      },
      {
        item: DILUTEDENERGYPOTION,
        cost: DILUTEDENERGYPOTION.averageCost * 1.5,
      },
      {
        item: MAGICBEAN,
        cost: MAGICBEAN.averageCost * 1.5,
      }
    ],
    cost: null,
  },
  secondTier: {
    name: "Trading Post",
    table: [],
    cost: [
      {
        item: WOOD,
        quantity: 20
      },
      {
        item: STONE,
        quantity: 20
      },
    ]
  },
  thirdTier: {
    name: "Bazaar",
    table: [],
    cost: [
      {
        item: WOOD,
        quantity: 50
      },
      {
        item: STONE,
        quantity: 50
      },
    ]
  },
}
