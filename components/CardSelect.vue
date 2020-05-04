<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" lg="4" v-for="card in cards" :key="card.id">
        <div class="CardWrapper">
          <SimplePointCard
            :title="`Card#${card.id}`"
            :point="card.point"
            :class="{
              'CardWrapper--select': selectingCardId == card.id,
              'CardWrapper--notselect': selectingCardId != card.id,
              'elevation-2': true
            }"
            @click="changeSelect(card.id)"
          >
          </SimplePointCard>
          <div class="SelectIcon elevation-3 d-flex justify-center align-center" v-if="selectingCardId == card.id">
            <span><v-icon>mdi-check-bold</v-icon></span>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<style scoped>
.CardWrapper {
  position: relative;
}
.CardWrapper--notselect {
  margin: 6px;
}
.CardWrapper--select {
  border: 6px solid yellowgreen;
}
.SelectIcon {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background: yellowgreen;
}
.SelectIcon * {
  color: white;
  font-size: 30px;
}
</style>
<script>
import Card from '~/models/Card.model.js';
import SimplePointCard from '~/components/SimplePointCard.vue';

export default {
  components: { SimplePointCard },
  data() {
    return {
      selectingCardId: 0,
    }
  },
  props: ['cards', 'value'],
  methods: {
    changeSelect(id) {
      this.selectingCardId = id;
      this.$emit('input', id);
    }
  }
}
</script>