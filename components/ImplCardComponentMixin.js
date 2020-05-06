export default {
  data() {
    return {
      lUpdateSize: _.debounce(this.updateSize, 100),
    }
  },
  computed: {
    cardSizeRatio() {
      return this.width / this.originalWidth;
    }
  },
  methods: {
    updateSize() {
      // console.log('update');
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
      // console.log(refSize);
      // const newSize = {};
      // Object.keys(this.size).forEach(function(key) {
      //   if (!!sizeMgn[key]) {
      //     newSize[key] = refSize * sizeMgn[key];
      //   }
      // });
      // this.size = newSize;
      console.log('Change');
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