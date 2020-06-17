require("dotenv").config();
const meli = require("mercadolibre");
const http = require("http");
const fs = require("fs");
const offsets = require("./src/meli/offsets.js");
const meliClient = new meli.Meli({
  client_id: process.env.client_id,
  client_secret: process.env.client_secret,
  access_token: process.env.access_token
});
const ACCESS_TOKEN = `access_token=${process.env.access_token}`;
const SELLER_ID = "206506677";
const getOrdersId = require("./src/meli/getOrdersId.js");
const sleep = require("sleep");

const extractEmails = packsId => {
  packsId.map(packId => {
    const GET_MESSAGES = `/messages/packs/${packId}/sellers/${SELLER_ID}?${ACCESS_TOKEN}`;
    meliClient.get(GET_MESSAGES, extractEmailsCallback);
  });
};

const extractEmailsCallback = (err, res) => {
  if (err) {
    return; console.log("extractEmailsCallback(): ", "err");
  }
  const messages = res.messages.map(message => message.text);
  const EMAIL_REGEXP = /[^ @?]+\@[a-z0-9.]+/g;
  const emails = messages.map(message => message.match(EMAIL_REGEXP));
  const emailsFiltered = emails.filter(email => email !== null);
  console.log(emailsFiltered);

  const contacts = emailsFiltered.map(email => {
    const contact = {
      email: email,
      "p[1]": "1"
    };
    return contact;
  });

  fs.appendFile("./users.csv", emailsFiltered.toString(), err => {
    if (err) {
      return console.log(err);
    }
  });
  return res;
};

getOrdersId(packsId => extractEmails(packsId));

http
  .createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Hello World!");
    res.end();
  })
  .listen(8080);
