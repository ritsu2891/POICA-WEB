<template>

  <div>
    <!-- <v-text-field
      label="ユーザ名"
      prepend-icon="mdi-magnify"
    ></v-text-field> -->

    <v-autocomplete
      v-model="acValue"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      label="ユーザ名"
      no-data-text="見つかりませんでした"
      prepend-icon="mdi-magnify"
    ></v-autocomplete>
  </div>
</template>
<script>
import * as UserRepo from '~/repos/UserRepo.js';
const _ = require('lodash');

export default {
  data() {
    return {
      acValue: null,
      users: [],
      isLoading: false,
      search: null,
      lFetchUser: (d) => {},
    }
  },
  computed: {
    items: function() {
      return this.users.map(user => ({
        text: user.displayName,
        value: user.id
      }));
    }
  },
  props: ['value'],
  mounted() {
    this.lFetchUser = _.debounce(this.fetchUser, 800);
  },
  watch: {
    search(val) {
      if (val) {
        this.isLoading = true;
        this.lFetchUser(val);
      }
    }
  },
  methods: {
    async fetchUser(displayName) {
      const users = await UserRepo.searchByDisplayName(displayName);
      if (users) {
        this.users = users;
      }
      this.$emit('input', this.acValue)
      this.isLoading = false;
    }
  }
}
</script>