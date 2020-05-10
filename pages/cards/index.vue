<template>
  <div style="height: 100%;" class="d-flex flex-column">
    <h1>登録済カード一覧</h1>
    <v-row v-if="cards.length > 0">
      <v-col cols="12" sm="6" lg="4" v-for="card in cards" :key="card.id">
        <PointCard :card="card" :master="masters[card.masterId]" :user="user" class="elevation-2"></PointCard>
      </v-col>
    </v-row>
    <div v-if="cards.length == 0" class="d-flex align-center justify-center flex-column flex-grow-1">
        <v-icon style="font-size: 150px;">mdi-credit-card-scan</v-icon>
        <div style="font-size: 30px; font-weight: 700;">登録済カードなし</div>
        <p>カード発行リンクを開いてカードを登録して下さい</p>
    </div>
  </div>
</template>
<script>
import PointCard from '~/components/PointCard.vue';
import * as RegisterCardRepo from '~/repos/RegisteredCardRepo.js';
import * as MasterRepo from '~/repos/CardMasterRepo.js';
import * as UserRepo from '~/repos/UserRepo.js';

export default {
  middleware: ['auth'],
  components: {PointCard},
  data() {
    return {
      cards: [],
      masters: {},
      user: null,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(self => {
      (async function() {
        let res = await RegisterCardRepo.getAll();
        const cards = res.data.cards;
        const masterIds = Array.from(new Set(cards.map(c => c.masterId)));
        const masterFetchPromises = masterIds.map(id => MasterRepo.getById(id));
        const masters = await Promise.all(masterFetchPromises);
        const user = await UserRepo.myProfile();
        self.cards = cards;
        self.masters = Object.fromEntries(masters.map(m => [m.id, m]));
        self.user = user;
      })();
    })
  }
}
</script>