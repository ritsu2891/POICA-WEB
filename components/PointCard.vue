<template>
  <component
    v-if="pointCardComponentName"
    :is="pointCardComponentName"
    :user="user"
    :card="card"
    :master="master"
  ></component>
</template>
<script>
import PointCardC1 from '~/components/PointCardC1.vue';
import PointCardC2 from '~/components/PointCardC2.vue';
import PointCardC3 from '~/components/PointCardC3.vue';

export default {
  components: {PointCardC1, PointCardC2, PointCardC3},
  props: ['user', 'card', 'master'],
  computed: {
    pointCardComponentName() {
      const assoc = {
        'b-c1': 'PointCardC1',
        'b-c2': 'PointCardC2',
        'b-c3': 'PointCardC3',
      }
      if (this.master && this.master.style) {
        const componentNameCd = assoc[this.master.style];
        if (componentNameCd) {
          return componentNameCd;
        } else {
          return null;
        }
      }
    }
  }
}
</script>