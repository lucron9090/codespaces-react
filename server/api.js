// api.jsconst axios = require("axios");

const BASE_URL = "https://oldie.veriftools.ru";
const AUTH_URL = `${BASE_URL}/api/frontend/token/`;
const MENUS_URL = `${BASE_URL}/api/frontend/category/`;
const FORMS_URL = `${BASE_URL}/api/frontend/generator/`;
const GEN_URL = `${BASE_URL}/api/integration/generate/`;
const STATUS_URL = `${BASE_URL}/api/integration/generation-status/`;

async function login(headers, data) {
  const response = await axios.post(AUTH_URL, data, { headers });
  return response.data;
}

async function getMenu(headers) {
  const response = await axios.get(MENUS_URL, { headers });
  return response.data;
}

async function getForm(slug, headers) {
  const response = await axios.get(`${FORMS_URL}/${slug}`, { headers });
  return response.data;
}

async function generate(taskId, headers) {
  const response = await axios.get(`${STATUS_URL}/${taskId}`, { headers });
  return response.data;
}

module.exports = {
  login,
  getMenu,
  getForm,
  generate,
};