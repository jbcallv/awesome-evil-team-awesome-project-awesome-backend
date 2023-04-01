import express from "express";
import dotenv from "dotenv";

const clientId = '33ceabe1d15f43f0bb7c75b5f96f7a91';
const redirectURI = 'https://mixify-me.netlify.app/';



//https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
// generate a string for pkce authorization
function generateRandomString(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

//https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
// encode authorization string
async function generateCodeChallenge(codeVerifier) {
  function base64encode(string) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return base64encode(digest);
}



dotenv.config()

const app = express()

app.get('/', (req, res) => {
  res.send("Init!")
})



app.get('/getspotify', () => {
  let verifier = generateRandomString(64);
  //https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
  generateCodeChallenge(verifier).then(codeChallenge => {
    let state = generateRandomString(16);
    let scope = 'user-read-private user-read-email';
  
    localStorage.setItem('verifier', verifier);
  
    let args = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });
  
    window.location = 'https://accounts.spotify.com/authorize?' + args;
  });
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Mixify Me on localhost:${PORT}`)
})


