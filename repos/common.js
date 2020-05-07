export { api, authorizedApi }

const axios = require('axios');
const Cookies = require('js-cookie');
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
      'X-POICA-Access-Token': '---', //何かダミーを入れないとヘッダーがキャッシュされる？
    }
  })); 
};
function authorizedApi() {
  if (Cookies.get('accessToken')) {
    return axios.create(_.merge(baseOptions, {
      headers: {
        'X-POICA-Access-Token': Cookies.get('accessToken'),
      }
    })); 
  } else {
    return api();
  }

}