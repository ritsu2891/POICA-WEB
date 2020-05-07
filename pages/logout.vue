<template>
  <div></div>
</template>
<script>
const Cookies = require('js-cookie');

export default {
  beforeRouteEnter(to, from, next) {
    next(self => {
      // 認証クッキー初期化処理
      // TODO:mixinでログインページと共通化 
      const authRelatedCookieKey = ['authResult', 'accessToken'];
      for (const key of authRelatedCookieKey) {
        Cookies.remove(key);
      }

      const redirectUri = Cookies.get('RedirectURI');
      if (redirectUri) {
        self.$router.push(redirectUri);
      }

      window.setTimeout(() => {
        self.$eventHub.$emit('loginStatusChange');
      }, 500);
    })
  }
}
</script>