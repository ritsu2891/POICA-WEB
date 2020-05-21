import Card from '~/models/Card.model.js';
import CardMaster from '~/models/CardMaster.model.js';

const endpoints = {
  add: 'cardmasters/add',
  remove: 'cardmasters/remove',
  list: 'cardmasters/list',
  getById: 'cardmasters/byId',
  getByRegToken: 'cardmasters/byRegToken',
  underControllCardOfUser: 'cardmasters/underControllCardOfUser',
};
const availableCardStyles = [
  'b-c1', 'b-c2', 'b-c3'
];

export default ({ app }, inject) => {
  inject('cardMasterRepo', {
    availableCardStyles: availableCardStyles,
    list: async function () {
      const res = await app.$authorizedApi().get(endpoints.list);
      const data = res.data;
      if (data.result == 'ok') {
        return data.masters.map((master) => new CardMaster(master));
      } else {
        return null;
      }
    },
    add: async function (opts) {
      const formData = new FormData();
      for (let key in opts) {
        if (opts[key]) {
          formData.append(key, opts[key]);
        }
      }
      const headers = { "content-type": "multipart/form-data" };
      const res = await app.$authorizedApi().post(endpoints.add, formData, headers);
      return res.data;
    }, 
    remove: async function (masterId) {
      return await app.$authorizedApi().post(endpoints.remove, {masterId: masterId});
    },
    getById: async function (id) {
      const res = await app.$api().get(endpoints.getById, {
        params: {
          id: id
        }
      });
      const data = res.data;
      if (data.result == 'ok') {
        return new CardMaster(data.master);
      } else {
        return null;
      }
    },
    getByRegToken: async function (regToken) {
      const res = await app.$api().get(endpoints.getByRegToken, {
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
    },
    underControllCardOfUser: async function (userId) {
      const res = await app.$authorizedApi().get(endpoints.underControllCardOfUser, {
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
  });
}