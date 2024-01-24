const express = require("express");
const session = require("express-session");
const axios = require("axios");
const app = express();

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if you're using HTTPS
  })
);
const BASE_URL = "https://oldie.veriftools.ru";
const AUTH_URL = `${BASE_URL}/api/frontend/token/`;
const MENUS_URL = `${BASE_URL}/api/frontend/category/`;
const FORMS_URL = `${BASE_URL}/api/frontend/generator/`;
const GEN_URL = `${BASE_URL}/api/integration/generate/`;
const STATUS_URL = `${BASE_URL}/api/integration/generation-status/`;

let clientHeader = "";
// Add a catch-all route handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});
// Add a global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});
app.post("/login", async (req, res) => {
  try {
    const login_headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: "https://verif.tools",
      Referer: "https://verif.tools/",
    };
    const response = await axios.post(AUTH_URL, {"username":"admin@lucron.org", "password":"Fucker900*"}, { login_headers });
    const accessToken = response.data.access;
    req.session.accessToken = accessToken; 
    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.get("/menu", async (req, res) => {
  const headers = {
    Origin: "https://verif.tools",
    Referer: "https://verif.tools/",
    Accept: "application/json",
    Authorization: `Bearer ${req.session.accessToken}`,
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get(MENUS_URL, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.get("/form/:slug", async (req, res) => {
  const headers = {
    Origin: "https://verif.tools",
    Referer: "https://verif.tools/",
    Accept: "application/json",
    Authorization: `Bearer ${req.session.accessToken}`,
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get(`${FORMS_URL}/${req.params.slug}`, {
      headers,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.post("/generate", async (req, res) => {
  const headers = {
    Origin: "https://verif.tools",
    Referer: "https://verif.tools/",
    Accept: "application/json",
    Authorization: `Bearer ${req.session.accessToken}`,
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get(`${STATUS_URL}/${req.params.taskId}`, {
      headers,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
