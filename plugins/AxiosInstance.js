const axios = require('axios');
const _ = require('lodash');

const baseOptions = {
  baseURL: process.env.API_URL,
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
  console.log('aaaaaa');
  console.log(process.env.API_URL);
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