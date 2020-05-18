const axios = require('axios');
const _ = require('lodash');

const baseOptions = {
  baseURL: `http://${process.env.API_FQDN}`,
  timeout: 30000,
  validateStatus: function (status) {
    return status < 500;
  }
};

function api() {
  return axios.create(_.merge(baseOptions, {
    headers: {
      //何かダミーを入れないとヘッダーがキャッシュされる？
      'X-POICA-Access-Token': '---',
    }
  })); 
};

function authorizedApi(accessToken) {
  if (accessToken) {
    return axios.create(_.merge(baseOptions, {
      headers: {
        'X-POICA-Access-Token': accessToken,
      }
    })); 
  } else {
    return api();
  }
}

export default ({ app }, inject) => {
  inject('api', () => {
    return api();
  });

  inject('authorizedApi', () => {
    return authorizedApi(app.$cookies.get('accessToken'));
  });
}