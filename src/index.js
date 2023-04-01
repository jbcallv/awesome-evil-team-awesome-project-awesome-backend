import express from "express";
import dotenv from "dotenv";
import querystring from "querystring";
import cors from "cors";
import axios from "axios";
import utils from "./utils.js";

dotenv.config()

const app = express()
app.use(cors());

/**
 * user-defined api endpoints here
 */
app.get("/login", (req, res) => {
  let state = utils.generateRandomString(16);
  let scope = 'user-read-private user-read-email';

  res.send('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: req.query.redirect_uri,
      state: state
    }));
})

app.get("/access-token", (req, res) => {
  let code = req.query.code;
  let redirect_uri = req.query.redirect_uri;

  let requestConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    }
  }

  let body = {
    code: code,
    redirect_uri: redirect_uri,
    grant_type: "authorization_code"
  }

  axios.post("https://accounts.spotify.com/api/token", body, requestConfig)
  .then((result) => {
    res.json({success: true, access_token: result.data.access_token});
  }).catch((error) => {
    res.json({success: false, message: "Invalid auth code"})
  })
})

app.get('/', (req, res) => {
  res.json({success: true})
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Mixify Me on localhost:${PORT}`)
})