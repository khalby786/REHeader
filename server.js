const express = require("express");
const app = express();
var session = require('express-session');
const fetch = require('node-fetch');
const util = require('util');
const path = require('path');
const fs = require('fs');
const readFilePromise = util.promisify(fs.readFile);
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false });

async function getAccessToken(code, client_id, client_secret) {
  const request = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code
    })
  });
  const text = await request.text();
  console.log("RESPONSE!!!");
  console.log(text);
  const params = new URLSearchParams(text);
  return params.get("access_token");
};

async function fetchGitHubUser(token) {
  const request = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: "token " + token
    }
  });
  return await request.json();
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", (request, response) => {
  if (request.session.loggedin === true) {
    response.redirect('/home');
  } else {
    response.sendFile(__dirname + "/views/homepage.html");
  }
});

app.get("/home", (req, res) => {
  if (req.session.loggedin === true) {
    res.render(__dirname + "/views/index.ejs", {
      avatar: req.session.github.avatar_url,
      user: req.session.username
    });
  } else {
    res.redirect('/')
  }
})

app.get("/login/github", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user%20public_repo`
  );
});

app.get("/login/github/callback", async (req, res) => {
  const code = req.query.code;
  const access_token = await getAccessToken(code, clientID, clientSecret);
  console.log(access_token);
  req.session.token = access_token;
  const user = await fetchGitHubUser(access_token);
  
  if (user) {
    req.session.access_token = access_token;
    req.session.github = user;
    req.session.githubId = user.id;
    req.session.loggedin = true;
    req.session.username = user.login;
    res.redirect("/home");
  } else {
    res.send("Login did not succeed!");
  }
});

app.post('/addimage', jsonParser, async (req, res) => {
  // if (req.session.loggedin === true) {
    const imagePath = req.body.imgurl;
  
    // const bytes = await readFilePromise(imagePath, 'binary');
    // const buffer = Buffer.from(imagePath, 'binary');
    // const content = buffer.toString('base64');
    
    let body = {
      "message": "header image generated using gh-readme-header-image-gen.glitch.me",
      "committer": {
        "name": "Khaleel Gibran",
        "email": "khalby786@gmail.com"
      },
      "content": imagePath
    };
  
    console.log(`https://api.github.com/repos/${req.session.username}/${req.session.username}/contents/header.png`);
    console.log(req.session.token)
    
    let request = await fetch(`https://api.github.com/repos/${req.session.username}/${req.session.username}/contents/header.png`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Authorization: "token " + req.session.token
      }
    })
    
    console.log(await request.json());
  // }
})

app.get("/logout", (req, res) => {
  req.session.destroy(function() {
    res.redirect('/');
  })
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
