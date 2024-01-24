const express = require('express');
const axios = require('axios');
const app = express();

const BASE_URL = 'https://oldie.veriftools.ru';
const AUTH_URL = `${BASE_URL}/api/frontend/token/`;
const MENUS_URL = `${BASE_URL}/api/frontend/category/`;
const FORMS_URL = `${BASE_URL}/api/frontend/generator/`;
const GEN_URL = `${BASE_URL}/api/integration/generate/`;
const STATUS_URL = `${BASE_URL}/api/integration/generation-status/`;
const headers = {
  "Origin": "https://verif.tools",
  "Referer": "https://verif.tools/", 
  'Content-Type': 'application/json',
};



/*var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(allowCrossDomain);
*/


app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(AUTH_URL, req.body, { headers });
    const accessToken = response.data.access;
    headers.Authorization = `Bearer ${accessToken}`;
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.get('/menu', async (req, res) => {
  try {
    const response = await axios.get(MENUS_URL, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});


app.get('/form/:slug', async (req, res) => {
  try {
    const response = await axios.get(`${FORMS_URL}/${req.params.slug}`, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.post('/generate', async (req, res) => {
  try {
    const response = await axios.post(GEN_URL, req.body, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.get('/status/:taskId', async (req, res) => {
  try {
    const response = await axios.get(`${STATUS_URL}/${req.params.taskId}`, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));