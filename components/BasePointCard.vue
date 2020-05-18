<template>
  <div>
  </div>
</template>
<script>
const _ = require('lodash');
const elementResizeEvent = require('element-resize-event');

export default {
  props: ['user', 'card', 'master', 'fitHeight'],
  data() {
    return {
      cardEl: null,
      width: 0,
      height: 0,
      lUpdateSize: _.debounce(this.updateSize, 100),
    }
  },
  computed: {
    cardWidth() {
      if (this.$el) {
        return this.$el.clientWidth;
      } else {
        return 0;
      }
    },
    cardHeight() {
      if (this.$el) {
        return this.$el.clientHeight;
      } else {
        return 0;
      }
    },
    cardSizeRatio() {
      return this.fitHeight ? this.height/this.originalHeight : this.width/this.originalWidth;
    },
  },
  mounted() {
    const self = this;
    self.lUpdateSize();
    elementResizeEvent(this.$el.parentNode, () => {self.lUpdateSize()});
  },
  methods: {
    updateSize() {
      // if (!this.size) {
      //   return;
      // }
      // const sizeMgn = {
      //   logo: 0.2, // 80 / 320
      //   title: 0.09375, // 30 / 320
      //   desc: 0.0625, // 20 / 320
      //   userDisplayName: 0.09375, // 30 / 320
      //   point: 0.25, // 80 / 320
      //   pointSuffix: 0.09375, // 30 / 320
      // };
      // const refSize = Math.min(this.cardWidth, this.cardHeight);
      // const newSize = {};
      // Object.keys(this.size).forEach(function(key) {
      //   if (!!sizeMgn[key]) {
      //     newSize[key] = refSize * sizeMgn[key];
      //   }
      // });
      // this.size = newSize;
      this.width = this.$el.clientWidth;
      console.log(this.$el.parentNode.clientHeight);
      this.height = this.fitHeight ? this.$el.parentNode.clientHeight : this.originalHeight * this.cardSizeRatio;
    }
  },
}
</script>