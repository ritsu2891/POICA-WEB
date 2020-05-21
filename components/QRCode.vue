<template>
  <div>
    <canvas ref="wrapper" :width="width"></canvas>
  </div>
</template>
<script>
import QRCode from 'qrcode'
const elementResizeEvent = require('element-resize-event');

export default {
  props: {
    value: {
      type: String,
      default: '',
    }
  },
  data: () => ({
    qrcode: null,
    width: 100,
  }),
  mounted() {
    const self = this;
    this.$nextTick(() => {
      self.width = self.$el.clientWidth;
      if (self.value && self.value.length > 0) {
        this.$nextTick(this.genQR);
      }
    })
  },
  methods: {
    genQR() {
      const self = this;
      QRCode.toCanvas(self.$refs.wrapper, self.value, {width: self.width}, function (error) {
        if (error) console.error(error)
      });
    }
  },
  watch: {
    value() {
      this.genQR();
    }
  }
}
</script>