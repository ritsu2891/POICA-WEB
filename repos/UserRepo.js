export { searchByDisplayName }

import { api } from '~/repos/common.js';

const endpoints = {
  searchByDisplayName: 'users/byDisplayName',
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