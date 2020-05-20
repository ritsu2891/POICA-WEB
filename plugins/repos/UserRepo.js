const endpoints = {
  checkIdDupl: 'users/checkIdDupl',
  myProfile: 'users/myProfile',
  searchByDisplayName: 'users/byDisplayName',
  searchByUserId: 'users/searchByUserId',
}

export default ({ app }, inject) => {
  inject('userRepo', {
    checkIdDupl: async function (userId) {
      const res = await app.$api().post(endpoints.checkIdDupl, {
        userId: userId
      });
      const data = res.data;
      if (data.result == 'ok') {
        return data.duplicate;
      } else {
        return false;
      }
    },
    myProfile: async function () {
      const res = await app.$authorizedApi().get(endpoints.myProfile);
      const data = res.data;
      if (data.result == 'ok') {
        return data.user;
      } else {
        return null;
      }
    },
    updateMyProfile: async function (profile) {
      const res = await app.$authorizedApi().post(endpoints.myProfile, profile);
      return res.data.result == 'ok';
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
    searchByUserId: async function (userId) {
      const res = await app.$api().get(endpoints.searchByUserId, {
        params: {
          userId: userId
        }
      });
      const data = res.data;
      if (data.result == 'ok') {
        return data.users;
      } else {
        return null;
      }
    }
  });
}