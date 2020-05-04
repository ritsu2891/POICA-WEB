export { api, authorizedApi }

const axios = require('axios');
const Cookies = require('js-cookie');
const _ = require('lodash');

const baseOptions = {
  baseURL: "http://localhost:4000",
  timeout: 1000,
  validateStatus: function (status) {
    return status < 500;
  }
};

const api = () => {return axios.create(baseOptions)};
const authorizedApi = () => {return axios.create(_.merge(baseOptions, {
  headers: {
    'X-POICA-Access-Token': Cookies.get('accessToken'),
  }
}))};