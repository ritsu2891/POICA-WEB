<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <div class="pa-5" align="center">
      <v-icon style="font-size: 150px;">mdi-login</v-icon>
      <h1 class="pb-2">ログインする</h1>
      <p v-if="authRequiredMessage"><b>要求された操作を実行するために、ログインが必要です。</b></p>
      <p>現在は<b>Googleアカウント</b>によるログインのみご利用いただけます。</p>
      <v-btn class="ma-2" tile color="primary" :loading="onAuthRequesting" @click="onGoogleLoginButtonClicked()">
        <v-icon left>mdi-google</v-icon> Googleでログイン
      </v-btn>
    </div>
  </div>
</template>
<script>
const axios = require('axios');
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

export default {
  data() {
    return {
      authProviderWindow: null,
      onAuthRequesting: false,
      authRequiredMessage: false,
    }
  },
  methods: {
    onGoogleLoginButtonClicked: async function() {
      this.onAuthRequesting = true;
      this.resetAuthResult();
      this.authProviderWindow = window.open(`http://${process.env.API_FQDN}/auth/google`, "ログイン画面", "width=300,height=500,scrollbars=yes");
      window.addEventListener("message", this.messageArrived, false);
    },
    resetAuthResult() {
      const authRelatedCookieKey = ['authResult', 'accessToken'];
      for (const key of authRelatedCookieKey) {
        this.$cookies.remove(key);
      }
    },
    async messageArrived(event) {
      if (event.origin != process.env.API_URL) {
        return;
      }
      window.removeEventListener("message", this.messageArrived, false);
      this.authProviderWindow.close();
      this.onAuthRequesting = false;

      this.$cookies.set('authResult', 'ok');
      this.$cookies.set('accessToken', event.data);

      this.$eventHub.$emit('loginStatusChange');

      const redirectUri = this.$cookies.get('RedirectURI');
      const user = await this.$userRepo.myProfile();
      console.log(user);
      if (user && user.init) {
        this.$router.push('/welcome');
      } else if (redirectUri) {
        this.$router.push(redirectUri);
      }
    }
  },
  mounted() {
    this.authRequiredMessage = this.$cookies.get('authRequiredMessage') ? true : false;
    this.$cookies.remove('authRequiredMessage');
  }
}
</script>