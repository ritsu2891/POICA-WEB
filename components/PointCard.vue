<template>
  <component
    v-if="pointCardComponentName"
    :is="pointCardComponentName"
    :user="_user"
    :card="_card"
    :master="master"
    :fitHeight="_fitHeight"
  ></component>
</template>
<script>
import PointCardC1 from '~/components/PointCardC1.vue';
import PointCardC2 from '~/components/PointCardC2.vue';
import PointCardC3 from '~/components/PointCardC3.vue';

export default {
  components: {PointCardC1, PointCardC2, PointCardC3},
  props: ['user', 'card', 'master', 'fitHeight'],
  computed: {
    pointCardComponentName() {
      const assoc = {
        'b-c1': 'PointCardC1',
        'b-c2': 'PointCardC2',
        'b-c3': 'PointCardC3',
      }

      const style = (this.master && this.master.style) ? this.master.style : 'b-c1';

      const componentNameCd = assoc[style];
      if (componentNameCd) {
        return componentNameCd;
      } else {
        return null;
      }
    },
    _fitHeight() {
      return this.fitHeight;
    },
    _user() {
      return this.user ? this.user : {
        displayName: '名前',
      };
    },
    _card() {
      return this.card ? this.card : {
        description: null,
        point: 0,
      }
    }
  }
}
</script>