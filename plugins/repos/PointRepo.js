const endpoints = {
  give: 'points/give'
}

export default ({ app }, inject) => {
  inject('pointRepo', {
    /*
    {
      as: 'admin' | 'user',
      media: 'direct' | 'uuid',
      masterId: _,
      cardId: _,
      optype: 'point-free',
      value: _,
    }
    */
    give: async function (opts) {
      const res = await app.$authorizedApi().post(endpoints.give, opts);
      const data = res.data;
      if (data.result == 'ok') {
        return true;
      } else {
        return false;
      }
    }
  });
}