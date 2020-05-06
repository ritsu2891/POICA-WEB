export default class Card {
  constructor(vals) {
    this.id = vals.id;
    this.masterId = vals.masterId;
    this.point = vals.point;
    // 5/6追加
    this.description = vals.description;
  }
}