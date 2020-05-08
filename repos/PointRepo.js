export { give }

import { api, authorizedApi } from '~/repos/common.js';

const endpoints = {
  give: 'points/give'
}

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
async function give(opts) {
  const res = await authorizedApi().post(endpoints.give, opts);
  const data = res.data;
  if (data.result == 'ok') {
    return true;
  } else {
    return false;
  }
}