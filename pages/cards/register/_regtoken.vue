<template>
  <div>
    <div v-if="false">
      <v-progress-circular
        :size="80"
        :width="5"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <h1 class="pt-3">カードを追加しています...</h1>
    </div>
    <div>
      <h1>カードを追加</h1>
      <div v-if="masterLoadState == ReqState.BEFORE_REQUEST">
        <p>カードの情報を取得しています...</p>
        <v-progress-circular
          :size="80"
          :width="5"
          color="primary"
          indeterminate
          class="pa-10"
        ></v-progress-circular>
      </div>
      <div v-if="masterLoadState == ReqState.REQUEST_FAILURE">
        <p>カードの情報の取得に失敗しました</p>
      </div>
      <div v-if="masterLoadState == ReqState.REQUEST_OK">
        <p v-if="master.canUserRegister() && cardRegisterState == ReqState.BEFORE_REQUEST">
          このカードを追加しますか？
        </p>
        <p v-if="cardRegisterState == ReqState.REQUESTING">
          カードを追加しています...
        </p>
        <p v-if="cardRegisterState == ReqState.REQUEST_FAILURE">
          カードを追加できませんでした
        </p>
        <p v-if="cardRegisterState == ReqState.REQUEST_OK">
          カードを追加しました
        </p>
        <p v-if="!master.canUserRegister()">このカードは追加できません</p>
        <simple-point-card class="my-3 elevation-5" :title="master.style + ''" :point="0" style="width: 350px;">
        </simple-point-card>
        <v-btn
          :disabled="!master.canUserRegister() || cardRegisterState == ReqState.REQUEST_OK"
          :loading="cardRegisterState == ReqState.REQUESTING"
          color="primary"
          @click="requestCardReg()"
        >
          追加する
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import SimplePointCard from '~/components/SimplePointCard.vue';
import * as MasterRepo from '~/repos/CardMasterRepo.js';
import * as CardRepo from '~/repos/RegisteredCardRepo.js';
import * as ReqState from '~/utils/APIRequestState.js';

export default {
  components: {SimplePointCard},
  layout: 'hvCenter',
  data() {
    return {
      ReqState: ReqState,
      masterLoadState: ReqState.BEFORE_REQUEST,
      cardRegisterState: ReqState.BEFORE_REQUEST,
      addingCard: false,
      master: {style: 0},
      regToken: '',
    }
  },
  beforeRouteEnter(to, from, next) {
    next(self => {
      self.regToken = self.$route.params.regtoken;
      self.fetchCardMaster();
    })
  },
  methods: {
    async fetchCardMaster() {
      const master = await MasterRepo.getByRegToken(this.regToken);
      if (master) {
        this.master = master;
        this.masterLoadState = ReqState.REQUEST_OK;
      } else {
        this.masterLoadState = ReqState.REQUEST_FAILURE;
      }
      return;
    },
    async requestCardReg() {
      this.cardRegisterState = ReqState.REQUESTING;
      const data = await CardRepo.register(this.master.id, this.regToken);
      if (data.result == 'ok') {
        this.cardRegisterState = ReqState.REQUEST_OK;
      } else {
        this.cardRegisterState = ReqState.REQUEST_FAILURE;
      }
    }
  }
}
</script>