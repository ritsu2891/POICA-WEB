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
import SimplePointCard from '~/components/SimplePointCard.vue'
import * as MasterRepo from '~/repos/CardMasterRepo.js'
import * as PointRepo from '~/repos/PointRepo.js';
import UserSelect from '~/components/UserSelect.vue';
import CardSelect from '~/components/CardSelect.vue';

export default {
  components: {SimplePointCard, UserSelect, CardSelect},
  data() {
    return {
      targetUserId: null,
      opCdCards: [],
      opTgCardId: null,
      masters: [],
      opTgMasterId: null,
      showMenu: [],
      pointIssueWindow: false,
      opPointAmount: null,
      pointIssueFormValid: false,
      pointIssueResult: null,
      rules: {
        pointAmount(value) {
          const numValue = Number(value);
          return (!isNaN(numValue) && Number.isInteger(numValue) && numValue > 0) || '0以上の整数を入力してください';
        }
      }
    }
  },
  computed: {
    filteredOpCdCards() {
      return this.opCdCards.filter(card => (card.masterId == this.opTgMasterId));
    },
    canExecPointIssue() {
      return this.pointIssueFormValid && this.opTgCardId != null && this.opPointAmount != null;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(self => {
      MasterRepo.list().then(res => {
        self.masters = res;
        self.masters.forEach((master) => {
          self.showMenu[`m${master.id}`] = false;
        })
      })
    })
  },
  watch: {
    targetUserId: function(newTargetUserId) {
      this.loadCards(newTargetUserId);
    },
  },
  methods: {
    showPointIssueWindow() {
      this.targetUserId = null;
      this.opCdCards = [];
      this.opTgCardId = null;
      this.pointIssueWindow = true;
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
    }
  }
}
</script>