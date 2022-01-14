import { DilutedHealthPotion, DilutedEnergyPotion } from '../../items/consumables/Potions.js';

const DILUTEDHEALTHPOTION = new DilutedHealthPotion(1);
const DILUTEDENERGYPOTION = new DilutedEnergyPotion(1);

export const PlainsShop = {
  tier: 1,
  type: 'Shop',
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
      }
    ],
    cost: null,
  },
  secondTier: {
    name: "Trading Post",
    table: [],
    cost: {
      wood: 20,
      stone: 20,
    }
  },
  thirdTier: {
    name: "Bazaar",
    table: [],
    cost: {
      wood: 50,
      stone: 50,
    }
  },
}
