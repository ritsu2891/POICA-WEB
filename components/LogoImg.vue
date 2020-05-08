<template>
  <span>
    <SvgFilter
      v-if="imgUrl && isSvg"
      :path="imgUrl"
      :width="width ? `${width}px` : null"
      :height="height ? `${height}px` : null"
      :fill="fillColor"
    >
    </SvgFilter>
    <img
      v-if="imgUrl && isImg"
      :src="imgUrl"
      :style="{
        width: width ? `${width}px` : null,
        height: height ? `${height}px` : null,
      }"
    >
  </span>
</template>
<script>
import SvgFilter from '~/components/vue-svg-filler.js';

export default {
  components: { SvgFilter },
  props: ['imgUrl', 'imgType', 'width', 'height', 'fillColor'],
  computed: {
    isSvg() {
      return this.imgType === 'image/svg+xml';
    },
    isImg() {
      const types = [
        'image/jpg',
        'image/jpeg',
        'image/png',
      ];
      return types.includes(this.imgType);
    },
  }
}
</script>