export default class CardMaster {
  constructor(vals) {
    this.id = vals.id;
    this.style = vals.style;
    this.ownerUserId = vals.ownerUserId;
    this.showInList = vals.showInList;
    this.regByURL = vals.regByURL;
    this.regToken = vals.regToken;
  }
  canUserRegister() {
    return this.showInList || this.regByURL;
  }
}