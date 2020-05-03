<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <div class="elevation-5 pa-5" align="center">
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
  layout: 'noContainer',
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
      this.authProviderWindow = window.open("http://localhost:4000/auth/google", "ログイン画面", "width=300,height=500,scrollbars=yes");
      await this.authResultWaitLoop();
      this.processAuthResult();
      this.authProviderWindow.close();
      this.onAuthRequesting = false;
    },
    processAuthResult() {
      const authResult = Cookies.get('authResult');
      const accessToken = Cookies.get('accessToken');
      if (authResult == 'ok') {
        console.log('ok');
        console.log(accessToken);
      } else {
        console.log('ng');
      }
    },
    authResultWaitLoop: async function() {
      let res = undefined;
      while (!res) {
        res = Cookies.get('authResult');
        await sleep(500);
      }
      return res;
    },
    resetAuthResult() {
      const authRelatedCookieKey = ['authResult', 'accessToken'];
      for (const key of authRelatedCookieKey) {
        Cookies.set(key, '', {
          expires: 0
        });
      }
    }
  }
}
</script>