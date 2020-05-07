<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <!-- ログイン・アバター -->
      <template v-if="userFetchState != ReqState.REQUESTING">
        <v-avatar v-if="user && user.iconUrl">
          <img :src="user.iconUrl">
        </v-avatar>
        <v-btn
          class="ml-2"
          rounded
          color="success"
          style="font-weight: 700"
          @click="loginBtnPushed"
          v-if="!loggedIn"
        >
          ログイン
        </v-btn>
        <v-btn
          class="ml-2"
          rounded
          color="error"
          style="font-weight: 700"
          @click="logoutBtnPushed"
          v-if="loggedIn"
        >
          ログアウト
        </v-btn>
      </template>
      <template v-if="userFetchState == ReqState.REQUESTING">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </template>
      <!-- ///////////// -->
    </v-app-bar>
    <v-content>
      <v-container style="height: 100%">
        <nuxt />
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <!-- スナックバー -->
    <v-snackbar
      v-model="snackbarShow"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      bottom
    >
      {{ snackbar.text }}
      <v-btn
        dark
        text
        @click="snackbarShow = false"
      >
        閉じる
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
const Cookies = require('js-cookie');
import * as ReqState from '~/utils/APIRequestState.js';
import * as UserRepo from '~/repos/UserRepo.js';

export default {
  data () {
    return {
      clipped: true,
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-apps',
          title: '利用しているカード',
          to: '/registered-cards'
        },
        {
          icon: 'mdi-apps',
          title: '管理しているカード',
          to: '/masters'
        }
      ],
      miniVariant: false,
      title: 'POICA',
      loggedIn: false,
      user: null,
      userFetchState: ReqState.BEFORE_REQUEST,
      ReqState: ReqState,
      snackbarShow: false,
      snackbar: {
        color: 'primary',
        text: '',
        timeout: 5000,
      },
    }
  },
  methods: {
    loginBtnPushed() {
      Cookies.set('RedirectURI', this.$route.path)
      this.$router.push('/login');
    },
    logoutBtnPushed() {
      Cookies.set('RedirectURI', this.$route.path)
      this.$router.push('/logout');
    },
    async userFetch(showMessage) {
      this.userFetchState = ReqState.REQUESTING;
      const user = await UserRepo.myProfile();
      if (user) {
        this.loggedIn = true;
        this.user = user;
      } else {
        this.loggedIn = false;
        this.user = null;
      }
      this.userFetchState = ReqState.REQUEST_OK;
    },
    showUserAuthMessage() {
      if (this.user) {
        this.snackbar = {
          color: 'success',
          text: 'ログインしました',
          timeout: 5000,
        };
        this.snackbarShow = true;
      } else {
        this.snackbar = {
          color: 'info',
          text: 'ログアウトしました',
          timeout: 5000,
        };
        this.snackbarShow = true;
      }
    }
  },
  mounted() {
    const self = this;
    this.userFetch();
    this.$eventHub.$on('loginStatusChange', () => {
      self.userFetch().then(() => {
        self.showUserAuthMessage();
      });
    });
  },
}
</script>
