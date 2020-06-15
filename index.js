require("dotenv").config();
const meli = require("mercadolibre");
const http = require("http");
const fs = require("fs");
const meliClient = new meli.Meli({
  client_id: process.env.client_id,
  client_secret: process.env.client_secret,
  access_token: process.env.access_token
});
const ACCESS_TOKEN = `access_token=${process.env.access_token}`;
const ITEM_ID = "MLC437789773";
const PACK_ID = "2391737297";
const packsId = ["2391737297"];
const USER_ID = "206506677";
const SELLER_ID = "206506677";

offsets = [
  "2000",
  "2050"
];

offsets.map(offset => {
  meliClient.get(
    `/orders/search?seller=${SELLER_ID}&offset=${offset}&${ACCESS_TOKEN}`,
    (err, res) => {
      if (err) {
        return err;
      }
      const ordersId = res.results.map(order => {
        packsId.push(`${order.id}`);
        return order.id;
      });
      console.log(packsId.length);
      // Return orders where pack_id is NOT null
      //console.log(res)
      packsId.map(packId => {
        meliClient.get(
          `/messages/packs/${packId}/sellers/${SELLER_ID}?${ACCESS_TOKEN}`,
          (err, res) => {
            if (err) {
              return err;
            }
            const EMAIL_REGEXP = /[^ @?]+\@[a-z0-9.]+/g;
            const messages = res.messages.map(message => message.text);
            const emails = messages.map(message => message.match(EMAIL_REGEXP));
            console.log(emails);

            const contacts = emails.map(email => {
              const contact = {
                email: email,
                "p[1]": "1"
              };
              return contact;
            });

            fs.appendFile("./users.csv", emails.toString(), err => {
              if (err) {
                return console.log(err);
              }
            });
            return res;
          }
        );
      });

      return ordersId;
    }
  );
});

// Para conocer el pack_id, deberás obtener el campo “pack_id” en la respuesta de /orders/<order_id>

http
  .createServer(function(req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Hello World!");
    res.end();
  })
  .listen(8080);
