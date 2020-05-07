<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <div class="pa-5" align="center">
      <h1 class="pb-2">ログインする</h1>
      現在は<b>Googleアカウント</b>によるログインのみご利用いただけます。<br>
      <v-btn class="ma-2" tile color="primary" :loading="onAuthRequesting" @click="onGoogleLoginButtonClicked()">
        <v-icon left>mdi-google</v-icon> Googleでログイン
      </v-btn>
    </div>
  </div>
</template>
<script>
const axios = require('axios');
const Cookies = require('js-cookie');
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

export default {
  data() {
    return {
      authProviderWindow: null,
      onAuthRequesting: false,
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
        Cookies.remove(key);
      }
    },
    messageArrived(event) {
      if (event.origin != process.env.API_URL) {
        return;
      }
      window.removeEventListener("message", this.messageArrived, false);
      this.authProviderWindow.close();
      this.onAuthRequesting = false;

      Cookies.set('authResult', 'ok');
      Cookies.set('accessToken', event.data);

      this.$eventHub.$emit('loginStatusChange');

      const redirectUri = Cookies.get('RedirectURI');
      if (redirectUri) {
        this.$router.push(redirectUri);
      }
    }
  }
}
</script>