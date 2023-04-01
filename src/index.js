import express from "express";
import dotenv from "dotenv";
import querystring from "querystring";
import cors from "cors";
import utils from "./utils.js";

dotenv.config()

const app = express()
app.use(cors());

/**
 * user-defined api endpoints here
 */
app.get("/login", (req, res) => {
  var state = utils.generateRandomString(16);
  var scope = 'user-read-private user-read-email';
  console.log(req)

  res.send('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: req.query.redirect_uri,
      state: state
    }));
})

app.get('/', (req, res) => {
  res.json({success: true})
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Mixify Me on localhost:${PORT}`)
})