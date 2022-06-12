import { NeutralTile } from './combatTiles';
import { Dummy } from '../monsters/Dummy';

const RED = 'RED';
const BLUE = 'BLUE';
const GREEN = 'GREEN';
const WHITE = 'WHITE';
const BLACK = 'BLACK';
const PURPLE = 'PURPLE';
const NEUTRAL = 'NEUTRAL';

export const TYPES = {
  RED,
  BLUE,
  GREEN,
  WHITE,
  BLACK,
  PURPLE,
  NEUTRAL
}

export const colorMap = {
  'r': RED,
  'l': BLUE,
  'g': GREEN,
  'w': WHITE,
  'b': PURPLE,
  'n': NEUTRAL
};

const NeutralField = [
  ['n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n'],
  ['n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n'],
  ['n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n'],
  ['n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n'],
  ['n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n'],
  ['n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n'],
];

const tileTypeMap = {
  'Plains': [ NeutralField ],
  'Void': []
}

const enemyMap = {
  'Plains': [
    Dummy
  ],
  'Void': [

  ]
}

export function createEnemies(tile) {
  const enemy = new enemyMap[tile.type][0](2, 7);
  console.log(enemy);

  return [enemy];
}

export function createBattleField(tile) {
  const field = tileTypeMap[tile.type][0];
  const map = [];

  field.forEach((row, i) => {
    const mapRow = [];
    row.forEach((tile, k) => {
      mapRow.push(new NeutralTile(i, k))
    });
    map.push(mapRow);
  });

  return map;
}
