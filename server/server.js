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

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Origin: "https://verif.tools",
    Referer: "https://verif.tools/",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = req.session.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

app.use(express.json());  // This line is important to parse JSON request body
app.use(
  session({
    secret: "antifafuckers",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // Set secure to true if you're using HTTPS
  })
);

app.post("/login", async (req, res) => {
  try {
    const login_headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: "https://verif.tools",
      Referer: "https://verif.tools/",
    };
    const { username, password } = req.body;  // Extract username and password from request body
    const response = await api.login(login_headers, { username, password });
    req.session.accessToken = response.access; 
    res.json({ data: response });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.get("/menu", async (req, res) => {
  try {
    const response = await axiosInstance.get(MENUS_URL);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.get("/form/:slug", async (req, res) => {
  try {
    const response = await axiosInstance.get(`${FORMS_URL}/${req.params.slug}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.post("/generate", async (req, res) => {
  try {
    const response = await axiosInstance.get(`${STATUS_URL}/${req.params.taskId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
