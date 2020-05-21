const endpoints = {
  getall: 'cards/list',
  register: 'cards/add',
  remove: 'cards/remove',
}

export default ({ app }, inject) => {
  inject('cardRepo', {
    getAll: async function () {
      return await app.$authorizedApi().get(endpoints.getall);
    },
    register: async function (id, token) {
      try {
        const result = await app.$authorizedApi().post(endpoints.register, {
          id: id,
          token: token
        });
        return result.data;
      } catch (e) {}
    },
    remove: async function (cardId) {
      return await app.$authorizedApi().post(endpoints.remove, {cardId: cardId});
    },
  });
}