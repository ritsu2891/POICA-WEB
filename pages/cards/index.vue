<template>
  <div style="height: 100%;" class="d-flex flex-column">
    <h1>登録済カード一覧</h1>
    <v-row v-if="cards.length > 0">
      <v-col cols="12" sm="6" lg="4" v-for="card in cards" :key="card.id">
        <div @click="e => onCardClick(e, card)">
          <PointCard
            :card="card"
            :master="masters[card.masterId]"
            :user="user"
            class="elevation-2"
          ></PointCard>
        </div>
      </v-col>
    </v-row>

    <!-- カードクリックメニュー -->
    <v-menu
      v-model="showCardClickMenu"
      :position-x="cardClickMenuX"
      :position-y="cardClickMenuY"
      absolute
      offset-y
    >
      <div>
        <v-list>
          <v-list-item @click="onReceivePointClick">
            <v-list-item-title>
              ポイントを受け取る
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="removeConfirmModalShow = true">
            <v-list-item-title>
              削除
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-menu>

    <!-- QR表示モーダル -->
    <v-dialog :width="500" v-model="qrShow">
      <div style="background: white; ">
        <QRCode :value="qrData" style="width: 100%"></QRCode>
        <div style="padding: 15px;">
          <v-alert type="info" v-if="qrHelpText" border="left" colored-border>
            {{qrHelpText}}
          </v-alert>
        </div>
      </div>
    </v-dialog>

    <!-- 確認メッセージモーダル -->
    <v-dialog :width="500" v-model="removeConfirmModalShow">
      <div style="background: white; padding: 15px">
        <v-alert type="warning" border="left" colored-border>
          本当にカードを削除しますか？この操作は取り消せません。
        </v-alert>
        <div align="right">
          <v-btn @click="removeConfirmModalShow = false">キャンセル</v-btn>
          <v-btn @click="onRemoveCardClickConfirmed" color="error">削除</v-btn>
        </div>
      </div>
    </v-dialog>

    <div v-if="cards.length == 0" class="d-flex align-center justify-center flex-column flex-grow-1">
        <v-icon style="font-size: 150px;">mdi-credit-card-scan</v-icon>
        <div style="font-size: 30px; font-weight: 700;">登録済カードなし</div>
        <p>カード発行リンクを開いてカードを登録して下さい</p>
    </div>
  </div>
</template>
<script>
import Card from '~/models/Card.model.js';

import PointCard from '~/components/PointCard.vue';
import QRCode from '~/components/QRCode.vue';

export default {
  middleware: ['auth'],
  components: {PointCard, QRCode},
  data() {
    return {
      cards: [],
      masters: {},
      user: null,

      qrShow: false,
      qrData: '',
      qrHelpText: null,

      targetCardId: null,

      showCardClickMenu: false,
      cardClickMenuX: 0,
      cardClickMenuY: 0,

      removeConfirmModalShow: false,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(self => {
      self.fetchCards()
    })
  },
  methods: {
    async fetchCards() {
      let res = await this.$cardRepo.getAll();
      const cards = res.data.cards;
      const masterIds = Array.from(new Set(cards.map(c => c.masterId)));
      const masterFetchPromises = masterIds.map(id => this.$cardMasterRepo.getById(id));
      const masters = await Promise.all(masterFetchPromises);
      const user = await this.$userRepo.myProfile();

      this.masters = Object.fromEntries(masters.filter(m => !!m).map(m => [m.id, m]));
      this.cards = cards.filter(c => Object.keys(this.masters).map(id => parseInt(id)).includes(c.masterId));
      this.user = user;
    },
    onCardClick(e, card) {
      this.targetCard = card;

      const self = this;
      self.showCardClickMenu = false;
      
      self.$nextTick(() => {
        
        self.cardClickMenuX = e.clientX;
        self.cardClickMenuY = e.clientY;
        
        self.$nextTick(() => {
          self.showCardClickMenu = true;
        });
      });
    },
    onReceivePointClick() {
      this.qrData = JSON.stringify({
        userId: this.user.userId,
        cardId: this.targetCard.id
      });
      this.qrHelpText = 'このQRコードをポイントカード管理者に読み取ってもらってください'
      this.$nextTick(() => {
        this.qrShow = true;
      });
    },
    async onRemoveCardClickConfirmed() {
      if (this.targetCard) {
        await this.$cardRepo.remove(this.targetCard.id);
        await this.fetchCards();
      }
      this.removeConfirmModalShow = false;
    }
  }
}
</script>