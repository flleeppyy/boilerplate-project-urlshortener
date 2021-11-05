require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;



class urls {

  constructor(db) {
    this.db = db;
    return (async () => {
      this.urls = db.get("urls") || [];
      return this
    })(); 
  }

  // git push/pull lmao
  async dbPush() {
    db.set("urls", this.urls);
    return true;  
  }

  async dbPull() {
    this.urls = db.get("urls");
    return true;
  }

  async push(original_url, short_url) {
    if (!original_url) {
      return new Error("Missing original_url");
    }

    if (!short_url) {
      return new Error("Missing short_url");
    }

    // kinda like an array i guess
    const pushedIndex = this.urls.push({
      original_url,
      short_url
    });

    this.dbPush();
    return pushedIndex;
  }


  async find(short_url) {
    return this.urls.find(e => e.short_url === short_url);
  }

  async remove(short_url) {
    if (!short_url) {
      return new Error("Missing short_url");
    }

    this.urls = this.urls.filter(e => e.short_url !== short_url)
    this.dbPush();
  }
}


const init = async (db, Urls) => {
  app.use(cors());

  app.use('/public', express.static(`${process.cwd()}/public`));

  app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

  // Your first API endpoint
  app.get('/api/hello', function(req, res) {
    res.json({ greeting: 'hello API' });
  });

  app.post("/api/shorturl", (req, res) => {
    if (!req.body) {
      return res.status(415).send({
        success: false,
        message: "No body",
        error_code: "EMPTY_BODY"
      })
    }

    if (!req.body.original_url || !req.body.short_url) {
      return res.status(400).send({
        success: false,
        message: "original_url or short_url was not provided",
        error_code: "MISSING_PARAMETERS"
      })
    }

    if (typeof req.body.original_url !== "string" || typeof req.body.short_url !== "string") {
      return res.status(400).send({
        success: false,
        message: "original_url or short_url is not a string",
        error_code: "PARAMETERS_NOT_STRING"
      });
    }

    if (req.body.short_url.length > 24) {
      return res.status(400).send({
        success: false,
        message: "short_url is greater than 24",
        error_code: "BAD_PARAMETER_LENGTH"
      })
    }

    try {
      new URL(req.body.original_url)
    } catch (e) {
      return res.status(400).send({
        success: false,
        message: "Url is not a valid url",
        error_code: "BAD_URL"
      });
    }

    Urls.push()


  })

  app.get(["/:shortUrl", "/api/shorturl/"], async (req, res) => {

  })  
}

const start = async () => {
  const db = await (require("./database"))();
  await init(db, new Urls());
  app.listen(port, function() {
    console.log(`Listening on port ${port}`);
  });

}