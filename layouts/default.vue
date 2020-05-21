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
        <v-avatar v-if="user && user.iconUrl" v-ripple @click="userProfileModalShow=true">
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

    <!-- ユーザプロフィールモーダル -->
    <v-dialog v-model="userProfileModalShow" width="500">
      <div style="background: white; padding: 15px;">
        <h1>プロフィール</h1>
        <v-alert type="info">
          プロフィール画像はGoogleのものを用いています。将来的にはこのサービス用の画像を別途指定できるようにする予定です。
        </v-alert>

        <div class="d-flex align-center">
          <v-avatar size="100" v-if="user && user.iconUrl" class="ma-3">
            <img :src="user.iconUrl">
          </v-avatar>

          <v-form v-model="userProfileValidate" class="flex-grow-1">
            <v-text-field
              label="ユーザID"
              v-model="inputUserId"
              :rules="[
                userProfileFieldRules.notEmpty,
                userProfileFieldRules.length,
                userProfileFieldRules.idCharType,
              ]"
              :error-messages="inputUserIdErrorMsgs"
            ></v-text-field>
            <v-text-field
              label="表示名"
              v-model="inputUserName"
              :rules="[
                userProfileFieldRules.notEmpty,
                userProfileFieldRules.length,
              ]"
            ></v-text-field>
          </v-form>
        </div>
        
        <div align="right" v-if="userProfileRenewState == ReqState.REQUEST_OK">更新しました</div>
        <div align="right" v-if="userProfileRenewState == ReqState.REQUEST_FAILURE">更新できませんでした</div>
        <div align="right">
          <v-btn color="error" @click="userProfileModalShow = false">
            キャンセル
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!userProfileValidate"
            :loading="userProfileRenewState == ReqState.REQUESTING"
            @click="renewUserProfile"
          >
            保存
          </v-btn>
        </div>
      </div>
    </v-dialog>

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
const _ = require('lodash');
import * as ReqState from '~/utils/APIRequestState.js';

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
          to: '/cards'
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

      // ユーザプロフィール変更
      userProfileValidate: null,
      userProfileModalShow: false,
      inputUserId: null,
      inputUserName: null,
      inputUserIdErrorMsgs: [],
      userProfileFieldRules: {
        idCharType: val => /^\w+$/.test(val) || '英数字およびアンダーライン(_)のみ利用可能です',
        length: val => (typeof(val) == 'string' && val.length > 0 && val.length <= 30) || '1〜30字で指定してください',
        notEmpty: val => !!val,
      },
      userProfileRenewState: ReqState.BEFORE_REQUEST,
      lCheckUserIdDupl: id => {},
    }
  },
  methods: {
    loginBtnPushed() {
      this.$cookies.set('RedirectURI', this.$route.path)
      this.$router.push('/login');
    },
    logoutBtnPushed() {
      this.$cookies.set('RedirectURI', this.$route.path)
      this.$router.push('/logout');
    },
    async userFetch(showMessage) {
      this.userFetchState = ReqState.REQUESTING;
      const user = await this.$userRepo.myProfile();
      if (user) {
        this.loggedIn = true;
        this.user = user;
      } else {
        this.loggedIn = false;
        this.user = null;
      }
      this.userFetchState = ReqState.REQUEST_OK;
    },
    async renewUserProfile() {
      this.userProfileRenewState = ReqState.REQUESTING;
      const updateRes = await this.$userRepo.updateMyProfile({
        userId: this.inputUserId,
        displayName: this.inputUserName,
      });
      if (updateRes) {
        this.userProfileRenewState = ReqState.REQUEST_OK;
      } else {
        this.userProfileRenewState = ReqState.REQUEST_FAILURE;
      }
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
    },
    async checkUserIdDupl(id) {
      if (await this.$userRepo.checkIdDupl(id)) {
        this.inputUserIdErrorMsgs = ['このIDは既に利用されています'];
      } else {
        this.inputUserIdErrorMsgs = [];
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
    this.$eventHub.$on('updateUserProfile', () => {
      self.userFetch();
    });
    this.lCheckUserIdDupl = _.debounce(this.checkUserIdDupl, 500);
  },
  watch: {
    userProfileModalShow(show) {
      if (show) {
        this.userProfileRenewState = ReqState.BEFORE_REQUEST;
      }
    },
    user(newUser) {
      this.inputUserId = newUser ? newUser.userId : null;
      this.inputUserName = newUser ? newUser.displayName : null;
    },
    inputUserId(newInputUserId) {
      if (newInputUserId) {
        this.lCheckUserIdDupl(newInputUserId);
      }
    }
  }
}
</script>
