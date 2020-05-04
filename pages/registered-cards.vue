<template>
  <div>
    <h1>登録済カード一覧</h1>
    <v-row>
      <v-col cols="12" sm="6" lg="4" v-for="card in cards" :key="card.id">
        <SimplePointCard :title="card.masterId + ''" :point="card.point" class="card elevation-5"></SimplePointCard>
      </v-col>
    </v-row>
  </div>
</template>
<style scoped>
.card {
  border-radius: 30px;
  height: 250px;
  /* width: 350px; */
}
</style>
<script>
import SimplePointCard from '~/components/SimplePointCard.vue'
import * as RegisterCardRepo from '~/repos/RegisteredCardRepo.js'

export default {
  components: {SimplePointCard},
  data() {
    return {
      cards: []
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      RegisterCardRepo.getAll().then(res => {
        vm.cards = res.data.cards;
      })
    })
  }
}
</script>