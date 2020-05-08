export { list, add, getByRegToken, underControllCardOfUser, availableCardStyles }

import { api, authorizedApi } from '~/repos/common.js';
import Card from '~/models/Card.model.js';
import CardMaster from '~/models/CardMaster.model.js';

const Cookies = require('js-cookie');

// const urljoin = require('url-join');
const endpoints = {
  add: 'cardmasters/add',
  list: 'cardmasters/list',
  getByRegToken: 'cardmasters/byRegToken',
  underControllCardOfUser: 'cardmasters/underControllCardOfUser',
};

const availableCardStyles = [
  'b-c1', 'b-c2', 'b-c3'
];

async function list() {
  const res = await authorizedApi().get(endpoints.list);
  const data = res.data;
  if (data.result == 'ok') {
    return data.masters.map((master) => new CardMaster(master));
  } else {
    return null;
  }
}

async function add(opts) {
  const formData = new FormData();
  for (let key in opts) {
    if (opts[key]) {
      formData.append(key, opts[key]);
    }
  }
  const headers = { "content-type": "multipart/form-data" };
  const res = await authorizedApi().post(endpoints.add, formData, headers);
  return res.data;
}

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

async function underControllCardOfUser(userId) {
  const res = await authorizedApi().get(endpoints.underControllCardOfUser, {
    params: {
      userId: userId
    }
  });
  const data = res.data;
  if (data.result == 'ok') {
    return data.cards.map(card => new Card(card));
  } else {
    return null;
  }
}