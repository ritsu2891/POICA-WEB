export { getAll, register }

import { authorizedApi } from '~/repos/common.js';

const endpoints = {
  getall: 'cards/list',
  register: 'cards/add',
}

async function getAll() {
  return await authorizedApi().get(endpoints.getall);
}

async function register(id, token) {
  try {
    const result = await authorizedApi().post(endpoints.register, {
      id: id,
      token: token
    });
    return result.data;
  } catch (e) {
  }
}