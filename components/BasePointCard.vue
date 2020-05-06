<template>
  <div>
  </div>
</template>
<script>
const elementResizeEvent = require('element-resize-event');

export default {
  props: ['user', 'card', 'master'],
  data() {
    return {
      cardEl: null,
      width: 0,
      lUpdateSize: _.debounce(this.updateSize, 100),
    }
  },
  computed: {
    cardWidth() {
      if (this.cardEl) {
        return this.cardEl.clientWidth;
      } else {
        return 0;
      }
    },
    cardHeight() {
      if (this.cardEl) {
        return this.cardEl.clientHeight;
      } else {
        return 0;
      }
    },
    height() {
      return this.originalHeight * this.cardSizeRatio;
    },
    cardSizeRatio() {
      return this.width / this.originalWidth;
    }
  },
  mounted() {
    this.cardEl = this.$el;
    this._cardSizeChanged();
    elementResizeEvent(this.$el, this._cardSizeChanged);
  },
  methods: {
    _cardSizeChanged() {
      this.cardEl = null;
      this.cardEl = this.$el;
    },
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
      this.width = this.cardWidth;
    }
  },
  watch: {
    cardWidth() {
      this.lUpdateSize();
    },
    // cardHeight() {
    //   this.lUpdateSize();
    // }
  }
}
</script>