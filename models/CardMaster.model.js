export default class CardMaster {
  constructor(vals) {
    this.id = vals.id;
    this.style = vals.style;
    this.ownerUserId = vals.ownerUserId;
    this.showInList = vals.showInList;
    this.regByURL = vals.regByURL;
    this.regToken = vals.regToken;
    // 5/5追加：リッチな表現第1段
    this.displayName = vals.displayName;
    this.logoUrl = vals.logoUrl;
    this.primaryColor = vals.primaryColor;
    this.backgroundColor = vals.backgroundColor || '#ffffff';
    this.textColor = vals.textColor || '#000000';
  }
  canUserRegister() {
    return this.showInList || this.regByURL;
  }
}