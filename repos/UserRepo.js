export { myProfile, searchByDisplayName }

import { api, authorizedApi } from '~/repos/common.js';

const endpoints = {
  myProfile: 'users/myProfile',
  searchByDisplayName: 'users/byDisplayName',
}

async function myProfile() {
  const res = await authorizedApi().get(endpoints.myProfile);
  const data = res.data;
  if (data.result == 'ok') {
    return data.user;
  } else {
    return null;
  }
}

async function searchByDisplayName(displayName) {
  const res = await api().get(endpoints.searchByDisplayName, {
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
}