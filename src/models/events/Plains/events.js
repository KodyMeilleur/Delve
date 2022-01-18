// import { Event } from '../../Event.js';
import { GoblinDen } from '../../structures/events/Plains/goblinDen.js';
import { Wood } from '../../items/resources/Wood.js';

const FIVEWOOD = new Wood(5);

export const Events = {
  structural: [
    {
      structure: GoblinDen,
    },
  ],
  effect: [
    {
      name: 'Plague',
      text: "You've somehow come in contact with a deadly illness.",
      effect: {
        type: 'Status',
        stat: 'poison',
      }
    }
  ],
  choice: [
    {
      name: "Quandry",
      text: "Choose between Either A or B",
      options: [
        {
          text: 'A',
          effect: {
            type: 'item',
            value: FIVEWOOD
          }
        },
        {
          text: 'B',
          effect: {
            type: 'damage',
            value: 10,
          }
        }
      ]
    }
  ],
  combat: [],
}
