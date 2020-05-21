<template>
  <div style="height: 100%;" class="d-flex flex-column">
    <h1>管理しているカード一覧</h1>
    <v-row v-if="masters.length > 0">
      <v-col cols="12" sm="6" lg="4" v-for="(master, id) in masters" :key="id">
        <v-menu
          v-model="showMenu[`m${master.id}`]"
          absolute
          offset-y
        >
          <template v-slot:activator="menuClickCb">
            <div
              v-on="menuClickCb.on"
              @click="masterClicked(master.id)"
            >
              <PointCard
                :master="master"
                class="elevation-2"
              ></PointCard>
            </div>
          </template>

          <v-list>
            <v-list-item @click="showPointIssueWindow()">
              <v-list-item-title>
                ポイント付与
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="shareRegCardLinkBtnClicked()">
              <v-list-item-title>
                カード登録用リンクをシェア
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <div v-if="masters.length == 0" class="d-flex align-center justify-center flex-column flex-grow-1">
        <v-icon style="font-size: 150px;">mdi-credit-card-scan</v-icon>
        <div style="font-size: 30px; font-weight: 700;">管理しているカードなし</div>
        <p>右下の「+」ボタンで作成してください</p>
    </div>

    <!-- ポイント発行ウィンドウ -->
    <v-dialog v-model="pointIssueWindow" width="800">
      <div class="modal">
        <h1>ポイント付与</h1>
          <v-row align="center">
            <v-col cols="12" xs="12" md="">
              <UserSelect v-model="targetUser"></UserSelect>
              <CardSelect v-model="opTgCardId" :user="targetUser" :masters="opTgMaster" :cards="filteredOpCdCards"></CardSelect>
              <p v-if="targetUser == null" align="center">ユーザを選択してください</p>
              <p v-if="targetUser != null && filteredOpCdCards.length == 0" align="center">選択できるカードがありません</p>
            </v-col>
            <v-col cols="12" xs="12" md="auto" align="center">
              <v-btn color="primary" @click="qrShow = true"><v-icon style="padding-right: 5px">mdi-qrcode-scan</v-icon>QRで指定</v-btn>
            </v-col>
          </v-row>
        <v-form v-model="pointIssueFormValid">
          <v-text-field
            label="付与量"
            v-model="opPointAmount"
            type="number"
            :rules="[rules.pointAmount]"
            prepend-icon="mdi-circle-multiple"
          ></v-text-field>
        </v-form>
        <div align="right">
          <p v-if="pointIssueResult == true">付与しました</p>
          <p v-if="pointIssueResult == false">付与に失敗しました</p>
          <v-btn color="primary" :disabled="!canExecPointIssue" @click="submitPointIssue()">付与実行</v-btn>
        </div>
      </div>
    </v-dialog>

    <QRReadModal v-model="qrData" :show-window="qrShow" @modalVisiblityChange="qrShow = $event"></QRReadModal>

    <!-- カード登録リンクシェア用シート -->
    <social-share
      v-model="socialShareSheet"
      :showMessage="socialShareShowMessage"
      :shareMessage="socialShareMessage"
      :url="socialShareUrl"
    ></social-share>

    <!-- マスタ新規作成ウィンドウ -->
    <v-dialog v-model="masterAddWindow" width="800">
      <div class="modal">
        <h1>カード新規作成</h1>
        <v-form v-model="masterAddFormValid">
          <v-text-field label="カード名称" :rules="[rules.required]" v-model="newMasterDisplayName"></v-text-field>

          <v-row justify-center>
            <v-col sm="4">
              <h2>プレビュー</h2>
              <PointCard :master="newMaster" class="elevation-2"></PointCard>
            </v-col>
            <v-col sm="8">
              <h2>デザイン設定</h2>
              <v-select v-model="newMasterStyle" :items="cardStyles" label="カードのデザイン"></v-select>
              <v-file-input
                v-model="newMasterLogo"
                show-size
                accept="image/jpg,image/jpeg,image/png,image/svg+xml"
                :rules="[rules.logoFileSize]"
                label="ロゴ画像"
              ></v-file-input>
              <v-row>
                <v-col sm="4" xs="12">
                  <span>メイン色</span>
                  <ColorPickField title="メイン色" v-model="newMasterPrimaryColor" :rgbLabel="true"></ColorPickField>
                </v-col>
                <v-col sm="4" xs="12">
                  <span>背景色</span>
                  <ColorPickField title="背景色" v-model="newMasterBackgroundColor" :rgbLabel="true"></ColorPickField>
                </v-col>
                <v-col sm="4" xs="12">
                  <span>文字色</span>
                  <ColorPickField title="文字色" v-model="newMasterTextColor" :rgbLabel="true"></ColorPickField>
                </v-col>
              </v-row>
              <div align="center">
                色を変更するには円をクリック/タップしてください
              </div>
            </v-col>
          </v-row>

          <h2>公開設定</h2>
          <v-row>
            <v-col sm="6">
              <v-switch
                v-model="newMasterShowInList"
                label="検索による登録を許可"
                disabled
              ></v-switch>
            </v-col>
            <v-col sm="6">
              <v-switch
                v-model="newMasterRegByUrl"
                label="URLによる登録を許可"
              ></v-switch>
            </v-col>
          </v-row>
        </v-form>

        <div align="right">
          <b v-if="masterAddResult == true">作成しました</b>
          <b v-if="masterAddResult == false">作成に失敗しました</b>
          <v-btn color="error" @click="masterAddWindow = false;">キャンセル</v-btn>
          <v-btn color="primary" :disabled="!canExecMasterAdd" @click="submitAddMaster">作成</v-btn>
        </div>
        
      </div>
    </v-dialog>

    <div style="position: fixed; right: 15px; bottom: 51px;">
      <v-btn color="primary" fab x-large dark @click="showAddMasterWindow">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<style scoped>
.modal {
  background: white;
  padding: 15px;
}
</style>
<script>
const _ = require('lodash');

import PointCard from '~/components/PointCard.vue';
import CardMaster from '~/models/CardMaster.model.js';
import UserSelect from '~/components/UserSelect.vue';
import CardSelect from '~/components/CardSelect.vue';
import ColorPickField from '~/components/ColorPickField.vue';
import SocialShare from '~/components/SocialShare.vue';
import QRReadModal from '~/components/QRReaderModal.vue';

export default {
  middleware: ['auth'],
  components: {PointCard, UserSelect, CardSelect, ColorPickField, SocialShare, QRReadModal},
  data() {
    return {
      masters: [],

      showMenu: [],
      pointIssueWindow: false,
      masterAddWindow: false,

      pointIssueFormValid: false,
      masterAddFormValid: false,

      pointIssueResult: null,
      masterAddResult: null,

      //ポイント発行
      targetUser: null,
      opCdCards: [],
      opTgCardId: null,
      opTgMasterId: null,
      opTgMaster: null,
      opPointAmount: null,

      //QRリーダ
      qrShow: false,
      qrData: null,

      //カード登録リンクシェア
      socialShareSheet: false,
      socialShareShowMessage: '',
      socialShareMessage: '',
      socialShareUrl: '',

      //マスタ作成
      cardStyles: this.$cardMasterRepo.availableCardStyles,
      newMasterStyle: this.$cardMasterRepo.availableCardStyles[2],
      newMasterDisplayName: 'ポイントカード',
      newMasterLogo: null,
      newMasterPrimaryColor: '#ff0000',
      newMasterBackgroundColor: '#ffffff',
      newMasterTextColor: '#000000',
      newMasterShowInList: false,
      newMasterRegByUrl: true,

      rules: {
        required(value) {
          return !!value || '必須の項目です';
        },
        pointAmount(value) {
          const numValue = Number(value);
          return (!isNaN(numValue) && Number.isInteger(numValue) && numValue > 0) || '0以上の整数を入力してください';
        },
        logoFileSize(value) {
          return !value || value.size < 2000000 || 'ファイルサイズは2MB以下にしてください';
        },
      }
    }
  },
  computed: {
    filteredOpCdCards() {
      return this.opCdCards.filter(card => (card.masterId == this.opTgMasterId));
    },
    canExecPointIssue() {
      return this.pointIssueFormValid && this.opTgCardId != null && this.opPointAmount != null;
    },
    canExecMasterAdd() {
      return this.masterAddFormValid;
    },
    newMaster() {
      const opts = {
        style: this.newMasterStyle,
        displayName: this.newMasterDisplayName,
        logoUrl: this.newMasterLogo ? window.URL.createObjectURL(this.newMasterLogo) : '',
        logoType: this.newMasterLogo ? this.newMasterLogo.type : null,
        primaryColor: this.newMasterPrimaryColor,
        backgroundColor: this.newMasterBackgroundColor,
        textColor: this.newMasterTextColor,
        showInList: this.newMasterShowInList,
        regByURL: this.newMasterRegByUrl,
      };
      return new CardMaster(opts);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(self => {
      self.fetchMasters();
    })
  },
  watch: {
    targetUser: async function(newTargetUser) {
      await this.loadCards(newTargetUser);
      if (this.opTgCardId) {
        let id = this.opTgCardId;
        this.opTgCardId = null;
        this.$nextTick(() => {
          this.opTgCardId = id;
        })
      }
    },
    qrData: async function(newQrData) {
      const self = this;
      let opt = null;
      try {
        opt = JSON.parse(newQrData);
      } catch (e) {
        return;
      }
      if (!(opt.userId && opt.cardId)) return;

      //カード
      this.opTgCardId = opt.cardId;

      //ユーザ
      const users = await self.$userRepo.searchByUserId(opt.userId);
      if (users.length > 0) {
        self.targetUser = users[0];
      }
    },
  },
  methods: {
    fetchMasters() {
      this.$cardMasterRepo.list().then(res => {
        if (res) {
          this.masters = res;
          this.masters.forEach((master) => {
            this.showMenu[`m${master.id}`] = false;
          });
        }
      });
    },
    showPointIssueWindow() {
      this.masters.forEach((master) => {
        this.showMenu[`m${master.id}`] = false;
      })
      this.targetUser = null;
      this.opCdCards = [];
      this.opTgCardId = null;
      this.pointIssueWindow = true;
    },
    async shareRegCardLinkBtnClicked() {
      const masterCds = (_.filter(this.masters, {'id': this.opTgMasterId}));
      if (masterCds.length < 1) return;
      const master = masterCds[0];

      this.socialShareShowMessage = `"${master.displayName}"の登録用リンクをシェアする`;
      this.socialShareMessage = `POICAで"${master.displayName}"を登録`;
      this.socialShareUrl = `${process.env.SELF_URL}/cards/register/${master.regToken}`;

      this.socialShareSheet = true;
    },
    showAddMasterWindow() {
      const self = this;
      this.masterAddWindow = true;
      this.newMasterStyle = this.$cardMasterRepo.availableCardStyles[0];
      this.newMasterDisplayName = 'ポイントカード';
      this.newMasterLogo = null;
      this.newMasterPrimaryColor = '#ff0000';
      this.newMasterBackgroundColor = '#ffffff';
      this.newMasterTextColor = '#000000';
      this.newMasterShowInList = false;
      this.newMasterRegByUrl = true;
      this.masterAddResult = null;
      requestAnimationFrame(function () {
        self.newMasterStyle = self.$cardMasterRepo.availableCardStyles[2];
      });
    },
    masterClicked(masterId) {
      this.opTgMasterId = masterId;
    },
    /**
     * @param {{id: number}} targetUser
     */
    async loadCards(targetUser) {
      const self = this;
      // this.opTgCardId = null;
      if (targetUser) {
        const cards = await this.$cardMasterRepo.underControllCardOfUser(targetUser.id);
        const masters = {};
        masters[self.opTgMasterId] = await this.$cardMasterRepo.getById(self.opTgMasterId);

        self.opCdCards = cards;
        self.opTgMaster = masters;
      } else {
        self.opCdCards = [];
      }
    },
    submitPointIssue() {
      if (this.canExecPointIssue) {
        const opt = {
          as: 'admin',
          media: 'direct',
          cardId: this.opTgCardId,
          opType: 'point-free',
          value: this.opPointAmount
        };
        const self = this;
        this.$pointRepo.give(opt).then(res => {
          self.pointIssueResult = res;
          self.loadCards(self.targetUser);
        });
      }
    },
    submitAddMaster() {
      const self = this;
      if (this.canExecMasterAdd) {
        const opts = {
          style: this.newMasterStyle,
          displayName: this.newMasterDisplayName,
          logo: this.newMasterLogo ? this.newMasterLogo : null,
          logoType: this.newMasterLogo ? this.newMasterLogo.type : null,
          primaryColor: this.newMasterPrimaryColor,
          backgroundColor: this.newMasterBackgroundColor,
          textColor: this.newMasterTextColor,
          showInList: this.newMasterShowInList,
          regByURL: this.newMasterRegByUrl,
        };
        this.$cardMasterRepo.add(opts).then(res => {
          self.masterAddResult = res.result == 'ok';
          if (self.masterAddResult) {
            self.fetchMasters();
          }
        });
      }
    }
  }
}
</script>