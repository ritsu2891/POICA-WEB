const endpoints = {
  myProfile: 'users/myProfile',
  searchByDisplayName: 'users/byDisplayName',
}

export default ({ app }, inject) => {
  inject('userRepo', {
    myProfile: async function () {
      const res = await app.$authorizedApi().get(endpoints.myProfile);
      const data = res.data;
      if (data.result == 'ok') {
        return data.user;
      } else {
        return null;
      }
    },
    searchByDisplayName: async function (displayName) {
      const res = await app.$api().get(endpoints.searchByDisplayName, {
        params: {
          displayName: displayName,
        }
      });
      const data = res.data;
      if (data.result == 'ok') {
        return data.users;
      } else {
        return null;
      }
    },
  });
}