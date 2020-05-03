export {getAll}

const axios = require('axios');
// const urljoin = require('url-join');
const endpoints = {
  getall: 'cards/list'
}

const api = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 1000
});

async function getAll() {
  return await api.get(endpoints.getall);
}