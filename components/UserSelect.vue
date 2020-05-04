<template>

  <div>
    <!-- <v-text-field
      label="ユーザ名"
      prepend-icon="mdi-magnify"
    ></v-text-field> -->

    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      label="ユーザ名"
      no-data-text="見つかりませんでした"
      prepend-icon="mdi-magnify"
      return-object
    ></v-autocomplete>
  </div>
</template>
<script>
import * as UserRepo from '~/repos/UserRepo.js';
const _ = require('lodash');

export default {
  data() {
    return {
      model: null,
      users: [],
      isLoading: false,
      search: null,
      lFetchUser: (d) => {},
    }
  },
  computed: {
    items: function() {
      return this.users.map(user => user.displayName);
    }
  },
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
      console.log(users);
      if (users) {
        this.users = users;
      }
      this.isLoading = false;
    }
  }
}
</script>