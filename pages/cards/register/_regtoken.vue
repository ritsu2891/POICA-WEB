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
      <div v-if="!master && masterLoadState != ReqState.REQUEST_FAILURE">
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
        <PointCard class="my-3 elevation-5" :master="master" :user="user" style="width: 350px;">
        </PointCard>
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
import PointCard from '~/components/PointCard.vue';
import * as ReqState from '~/utils/APIRequestState.js';
import CardMaster from '~/models/CardMaster.model.js';

export default {
  // middleware: ['auth'],
  components: {PointCard},
  layout: 'hvCenter',
  head() {
    return {
      meta: [
        { hid: 'description', name: 'description', content: `POICA(α)で"${this.master ? this.master.displayName : ''}"を登録する` },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:title', property: 'og:title', content: `"${this.master ? this.master.displayName : ''}"を登録する - POICA(α)` },
        { hid: 'og:description', property: 'og:description', content: `POICA(α)で"${this.master ? this.master.displayName : ''}"を登録する` },
        { hid: 'og:url', property: 'og:url', content: `${process.env.SELF_URL}${this.$router.currentRoute.fullPath}` },
        { hid: 'og:image', property: 'og:image', content: `${process.env.API_URL}/uploads/master/cardimage/${this.master.regToken}.jpeg` },
        { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
      ],
    }
  },
  async asyncData(ctx) {
    const regToken = ctx.params.regtoken;
    const user = await ctx.app.$currentUser();
    const master = await ctx.app.$cardMasterRepo.getByRegToken(regToken);
    return { 
      regToken: regToken,
      user: user,
      master: master,
    };
  },
  data() {
    return {
      ReqState: ReqState,
      cardRegisterState: ReqState.BEFORE_REQUEST,
      addingCard: false,
    }
  },
  computed: {
    masterLoadState() {
      return this.master ? ReqState.REQUEST_OK : ReqState.REQUEST_FAILURE;
    }
  },
  created() {
    this.master = new CardMaster(this.master);
  },
  methods: {
    async requestCardReg() {
      this.cardRegisterState = ReqState.REQUESTING;
      const data = await this.$cardRepo.register(this.master.id, this.regToken);
      if (data.result == 'ok') {
        this.cardRegisterState = ReqState.REQUEST_OK;
      } else {
        this.cardRegisterState = ReqState.REQUEST_FAILURE;
      }
    }
  }
}
</script>