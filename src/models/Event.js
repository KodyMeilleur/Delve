// import CONST from '../CONST';
// import { getRandomInt } from '../services/generateLand';

export function Event(type) {
  this.script = null;
  this.fired = false;

  switch (type) {
    case 'Alert':
      this.script = () => {
        window.alert('Alert Event!')
      }
      break;
    default:
      break;
  }
}
