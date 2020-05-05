export { list, getByRegToken, underControllCardOfUser }

import { api, authorizedApi } from '~/repos/common.js';
import Card from '~/models/Card.model.js';
import CardMaster from '~/models/CardMaster.model.js';

const Cookies = require('js-cookie');

// const urljoin = require('url-join');
const endpoints = {
  list: 'cardmasters/list',
  getByRegToken: 'cardmasters/byRegToken',
  underControllCardOfUser: 'cardmasters/underControllCardOfUser',
};

async function list() {
  const res = await authorizedApi().get(endpoints.list);
  const data = res.data;
  if (data.result == 'ok') {
    return data.masters.map((master) => new CardMaster(master));
  } else {
    return null;
  }
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