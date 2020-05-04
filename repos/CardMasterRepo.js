export { getByRegToken }

import { api } from '~/repos/common.js';
import CardMaster from '~/models/CardMaster.model.js';

const Cookies = require('js-cookie');

// const urljoin = require('url-join');
const endpoints = {
  getByRegToken: 'cardmasters/byRegToken'
};

async function getByRegToken(regToken) {
  const res = await api().get(endpoints.getByRegToken, {
    params: {
      regToken: regToken
    }
  });
  const data = res.data;
  if (data.result == 'ok') {
    return new CardMaster(data.master);
  } else {
    return null;
  }
}