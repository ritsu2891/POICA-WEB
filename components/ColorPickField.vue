<template>
  <div>
    <v-avatar
      :color="value" class="elevation-2" v-ripple
      @click.stop="colorPreviewClicked"
      style="border: 1px solid black;"
    >
    </v-avatar>
    <span v-if="rgbLabel">
      {{value}}
    </span>
    <v-dialog v-model="colorPickModalShow" width="unset">
      <div style="background: white;">
        <h1 class="pa-3" v-if="title">{{title}}</h1>
        <v-color-picker v-model="pickerValue" class="elevation-0"></v-color-picker>
        <div align="right" class="pa-3">
          <v-btn color="error" @click="cancelBtnClicked">キャンセル</v-btn>
          <v-btn color="primary" @click="saveBtnClicked">保存</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ['title', 'value', 'rgbLabel'],
  data: () => ({
    colorPickModalShow: false,
    pickerValue: null,
  }),
  mounted() {
    this.pickerValue = this.value;
  },
  methods: {
    colorPreviewClicked() {
      this.pickerValue = this.value;
      this.colorPickModalShow = true;
    },
    cancelBtnClicked() {
      this.colorPickModalShow = false;
    },
    saveBtnClicked() {
      this.$emit('input', this.pickerValue);
      this.colorPickModalShow = false;
    },
  }
}
</script>