export function Coin (quantity) {
  this.sprite = 'assets/hudSprites/coinIconSingle.png';
  this.quantity = quantity;
  this.name = "Coin";

  this.effect = {
    type: 'Coin'
  }
}
