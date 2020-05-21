<template>
  <div class="d-flex align-center justify-center" style="height: 100%;">
    <div style="max-width: 400px">
      <h1>ようこそPOICAヘ</h1>
      <v-alert type="info" border="left" colored-border>
        ユーザIDを設定してください
      </v-alert>
      <v-form  v-model="inputUserIdValid">
        <v-text-field
          label="ユーザID"
          v-model="inputUserId"
          :rules="[
            rules.notEmpty,
            rules.length,
            rules.idCharType,
          ]"
          :error-messages="inputUserIdErrorMsgs"
        ></v-text-field>
      </v-form>
      <div align="right">
        <v-btn color="primary" :disabled="!inputUserIdValid" @click="onSetUserIdBtnClicked">OK</v-btn>
      </div>
    </div>
  </div>
</template>
<script>
const _ = require('lodash');

export default {
  data() {
    return {
      inputUserIdValid: false,
      inputUserId: null,
      inputUserIdErrorMsgs: [],
      rules: {
        idCharType: val => /^\w+$/.test(val) || '英数字およびアンダーライン(_)のみ利用可能です',
        length: val => (typeof(val) == 'string' && val.length > 0 && val.length <= 30) || '1〜30字で指定してください',
        notEmpty: val => !!val,
      },
      lCheckUserIdDupl: id => {},
    }
  },
  mounted() {
    this.lCheckUserIdDupl = _.debounce(this.checkUserIdDupl, 500);
  },
  watch: {
    inputUserId(newInputUserId) {
      if (newInputUserId) {
        this.lCheckUserIdDupl(newInputUserId);
      }
    }
  },
  methods: {
    async checkUserIdDupl(id) {
      if (await this.$userRepo.checkIdDupl(id)) {
        this.inputUserIdErrorMsgs = ['このIDは既に利用されています'];
      } else {
        this.inputUserIdErrorMsgs = [];
      }
    },
    async onSetUserIdBtnClicked() {
      const updateRes = await this.$userRepo.updateMyProfile({
        userId: this.inputUserId,
      });
      this.$eventHub.$emit('updateUserProfile');
      this.$router.push('/');
    }
  }
}
</script>