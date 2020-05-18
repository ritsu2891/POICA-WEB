<template>
  <div class="d-flex justify-center align-center">
    <div
      :style="{
        width: '100%',
        height: `${height}px`
      }"
    >
      <PointCard
        v-if="master"
        :master="master"
        :user="user"
        :fitHeight="true"
        class="elevation-3"
      >
      </PointCard>
    </div>
  </div>
</template>
<script>
import PointCard from '~/components/PointCard.vue';

export default {
  components: {PointCard},
  layout: 'raw',
  data: () => ({
    user: null,
    master: null,
    loaded: false,
    height: 0
  }),
  mounted() {
    this.user = {
      'displayName': ''
    };
    this.fetchMaster();
    const self = this;
    window.setTimeout(function() {
      self.height = window.innerHeight;
    },1000)
  },
  methods: {
    async fetchMaster() {
      const regToken = this.$route.params.regtoken;
      if (!regToken) return;
      const master = await this.$cardMasterRepo.getByRegToken(regToken);
      this.master = master;
      this.loaded = true;
    }
  }
}
</script>