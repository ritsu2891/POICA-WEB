<template>
  <div>
    <h1>管理しているカード一覧</h1>
    <v-row>
      <v-col cols="12" sm="6" lg="4" v-for="(master, id) in masters" :key="id">
        <v-menu
          v-model="showMenu[`m${master.id}`]"
          absolute
          offset-y
        >
          <template v-slot:activator="menuClickCb">
            <SimplePointCard
              :title="master.id + ''"
              :point="1"
              class="card elevation-2"
              v-on="menuClickCb.on"
              @click="masterClicked(master.id)"
            ></SimplePointCard>
          </template>

          <v-list>
            <v-list-item @click="showPointIssueWindow()">
              <v-list-item-title>
                ポイント付与
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <!-- ポイント発行ウィンドウ -->
    <v-dialog v-model="pointIssueWindow" width="800">
      <div class="modal">
        <h1>ポイント付与</h1>
          <UserSelect v-model="targetUserId"></UserSelect>
          <CardSelect v-model="opTgCardId" :cards="filteredOpCdCards"></CardSelect>
          <p v-if="targetUserId == null" align="center">ユーザを選択してください</p>
          <p v-if="targetUserId != null && filteredOpCdCards.length == 0" align="center">選択できるカードがありません</p>
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
.card {
  border-radius: 30px;
  height: 250px;
  /* width: 350px; */
}
.modal {
  background: white;
  padding: 15px;
}
</style>
<script>
import SimplePointCard from '~/components/SimplePointCard.vue';
import PointCard from '~/components/PointCard.vue';
import * as MasterRepo from '~/repos/CardMasterRepo.js';
import * as PointRepo from '~/repos/PointRepo.js';
import CardMaster from '~/models/CardMaster.model.js';
import UserSelect from '~/components/UserSelect.vue';
import CardSelect from '~/components/CardSelect.vue';
import ColorPickField from '~/components/ColorPickField.vue';

export default {
  components: {PointCard, SimplePointCard, UserSelect, CardSelect, ColorPickField},
  data() {
    return {
      showMenu: [],
      pointIssueWindow: false,
      masterAddWindow: false,

      pointIssueFormValid: false,
      masterAddFormValid: false,

      pointIssueResult: null,
      masterAddResult: null,

      //ポイント発行
      targetUserId: null,
      opCdCards: [],
      opTgCardId: null,
      masters: [],
      opTgMasterId: null,
      opPointAmount: null,

      //マスタ作成
      cardStyles: MasterRepo.availableCardStyles,
      newMasterStyle: MasterRepo.availableCardStyles[2],
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
    targetUserId: function(newTargetUserId) {
      this.loadCards(newTargetUserId);
    },
  },
  methods: {
    fetchMasters() {
      MasterRepo.list().then(res => {
        this.masters = res;
        this.masters.forEach((master) => {
          this.showMenu[`m${master.id}`] = false;
        })
      });
    },
    showPointIssueWindow() {
      this.targetUserId = null;
      this.opCdCards = [];
      this.opTgCardId = null;
      this.pointIssueWindow = true;
    },
    showAddMasterWindow() {
      const self = this;
      this.masterAddWindow = true;
      this.newMasterStyle = MasterRepo.availableCardStyles[0];
      this.newMasterDisplayName = 'ポイントカード';
      this.newMasterLogo = null;
      this.newMasterPrimaryColor = '#ff0000';
      this.newMasterBackgroundColor = '#ffffff';
      this.newMasterTextColor = '#000000';
      this.newMasterShowInList = false;
      this.newMasterRegByUrl = true;
      this.masterAddResult = null;
      requestAnimationFrame(function () {
        self.newMasterStyle = MasterRepo.availableCardStyles[2];
      });
    },
    masterClicked(masterId) {
      this.opTgMasterId = masterId;
    },
    loadCards(targetUserId) {
      const self = this;
      if (targetUserId) {
        MasterRepo.underControllCardOfUser(targetUserId).then(cards => {
          self.opCdCards = cards;
        });
      }
      self.opCdCards = [];
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
        PointRepo.give(opt).then(res => {
          self.pointIssueResult = res;
          self.loadCards(self.targetUserId);
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
        MasterRepo.add(opts).then(res => {
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