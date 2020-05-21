<template>
  <div>
    <v-autocomplete
      v-model="acValue"
      :items="items"
      :loading="userFetchState == ReqState.REQUESTING"
      :search-input.sync="search"
      label="ユーザ名"
      :no-data-text="resultHelpText"
      prepend-icon="mdi-magnify"
    ></v-autocomplete>
  </div>
</template>
<script>
const _ = require('lodash');
import * as ReqState from '~/utils/APIRequestState.js';

export default {
  data() {
    return {
      acValue: null, // AutoComplete Value
      users: [],
      search: null,
      lFetchUser: (d) => {},
      userFetchState: ReqState.BEFORE_REQUEST,
      ReqState: ReqState,
    }
  },
  computed: {
    items: function() {
      const items = this.users.map(user => ({
        text: `${user.displayName} (${user.userId})`,
        value: user.id
      }));
      return items;
    },
    resultHelpText: function() {
      if (this.userFetchState == ReqState.BEFORE_REQUEST) {
        return "入力すると検索を開始します"
      } else if (this.userFetchState == ReqState.REQUESTING) {
        return "検索中です..."
      } else if (this.userFetchState == ReqState.REQUEST_OK) {
        return "見つかりませんでした"
      }
    }
  },
  props: ['value'],
  mounted() {
    this.lFetchUser = _.debounce(this.fetchUser, 800);
  },
  watch: {
    search(val) {
      // 選択後、選択されたアイテムの表示用テキストで検索されるのを防止
      if (this.items) {
        const item = _.find(this.items, { value: this.acValue });
        if (item && val == item.text) return;
      }

      if (val) {
        this.userFetchState = ReqState.REQUESTING;
        this.lFetchUser(val);
      }
    },
    value(newValue) {
      if (newValue == null) {
        this.search = null;
        this.users = [];
        this.acValue = null;
      } else {
        // 選択肢用の配列に同一の値オブジェクトがないと、ちゃんと表示されない
        // https://github.com/vuetifyjs/vuetify/issues/7609
        this.users = [newValue];

        this.acValue = newValue.id;
      }
    },
    acValue(newAcValue) {
      // acValue -> value -> acValueによる出戻りを防止
      if (this.value && newAcValue == this.value.id) return;

      this.$emit('input', _.find(this.users, { id: newAcValue }));
    },
  },
  methods: {
    async fetchUser(displayName) {
      const users = await this.$userRepo.searchByDisplayName(displayName);
      if (users) {
        this.users = users;
      }
      this.userFetchState = ReqState.REQUEST_OK;
    },
  }
}
</script>