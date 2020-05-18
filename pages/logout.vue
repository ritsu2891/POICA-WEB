<template>
  <div></div>
</template>
<script>
export default {
  beforeRouteEnter(to, from, next) {
    next(self => {
      // 認証クッキー初期化処理
      // TODO:mixinでログインページと共通化 
      const authRelatedCookieKey = ['authResult', 'accessToken'];
      for (const key of authRelatedCookieKey) {
        self.$cookies.remove(key);
      }

      const redirectUri = self.$cookies.get('RedirectURI');
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