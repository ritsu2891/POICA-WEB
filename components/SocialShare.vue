<template>
  <v-bottom-sheet v-model="show" inset>
    <div style="background: white" class="pa-3">
      <div align="center" class="mt-2">
        <p>
          <b>{{showMessage}}</b><br>
          {{url}}
        </p>
      </div>
      <div class="d-flex justify-space-around align-center">
        <div align="center" class="px-4 py-1" v-ripple @click="mail()">
          <v-icon style="font-size: 50px;" color="primary">mdi-email</v-icon>
          <div class="mt-1">メール</div>
        </div>
        <div align="center" class="px-4 py-1" v-ripple @click="line()">
          <img src="/social-share/line.svg" style="width: 50px;">
          <div class="mt-1">LINE</div>
        </div>
        <div align="center" class="px-4 py-1" v-ripple @click="clipboard()">
          <v-icon style="font-size: 50px;">mdi-content-copy</v-icon>
          <div class="mt-1">コピー</div>
        </div>
      </div>
    </div>
  </v-bottom-sheet>
</template>
<script>
export default {
  props: ['value', 'showMessage', 'shareMessage', 'url'],
  data: () => ({
    show: false,
  }),
  computed: {
    builtMessage() {
      return `${this.shareMessage} - ${this.url}`;
    }
  },
  watch: {
    value(newValue) {
      this.show = newValue;
    },
    show(newShow) {
      this.$emit('input', newShow);
    }
  },
  mounted() {
    this.show = this.value;
  },
  methods: {
    mail() {
      window.location = `mailto:?body=${encodeURI(this.builtMessage)}`;
      this.show = false;
    },
    line() {
      window.open(`https://timeline.line.me/social-plugin/share?url=${encodeURI(this.url)}`, "", "width=500,height=500,scrollbars=yes");
      this.show = false;
    },
    clipboard() {
      if (navigator.clipboard) {
        // Chrome, Edge, Firefox
        navigator.clipboard.writeText(this.url);
      } else if (window.clipboardData) {
        // IE
        window.clipboardData.setData("Text", this.url);
      }
      this.show = false;
    }
  }
}
</script>