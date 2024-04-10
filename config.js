const dotenv = require("dotenv").config({ path: "src/.env" });

const API_KEY = process.env?.NG_APP_API_KEY;
const APP_TEST = process.env?.APP_TEST;
console.log(`API_KEY :${API_KEY}`);
console.log(`APP_TEST :${APP_TEST}`);
