<template>
  <canvas ref="wrapper" :width="width"></canvas>
</template>
<script>
import QRCode from 'qrcode'

export default {
  props: {
    width: {
      type: Number,
      default: 100,
    },
    value: {
      type: String,
      default: '',
    }
  },
  data: () => ({
    qrcode: null,
  }),
  mounted() {
    QRCode.toCanvas(this.$refs.wrapper, this.value, {width: this.width}, function (error) {
      if (error) console.error(error)
      console.log('success!');
    });
  },
  watch: {
    value(newValue) {
      this.qrcode.makeCode(newValue);
    }
  }
}
</script>