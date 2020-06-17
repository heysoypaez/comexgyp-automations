require("dotenv").config();
const meli = require("mercadolibre");
const offsets = require("./offsets.js");
const meliClient = new meli.Meli({
  client_id: process.env.client_id,
  client_secret: process.env.client_secret,
  access_token: process.env.access_token
});
const ACCESS_TOKEN = `access_token=${process.env.access_token}`;
const SELLER_ID = "206506677";

const apiFetchOrdersId = (err, res, usePacksId, packsId) => {
  if (err) {
    return console.log("apiFetchOrdersId: error");
  }

  if (packsId.length > 170) {
    return true;
  }
  res.results.map(order => {
    packsId.push(`${order.id}`);
  });
  usePacksId(packsId);
};

function getOrdersId(usePacksId, apiFetch, packsId = []) {
  const ordersId = offsets.map(offset => {
    const API_REQUEST = `/orders/search?seller=${SELLER_ID}&offset=${offset}&${ACCESS_TOKEN}`;
    meliClient.get(API_REQUEST, (res, err) => {
      apiFetchOrdersId(res, err, usePacksId, packsId);
    });
    return offset;
  });
  return true;
}

// getOrdersId((s) =>console.log(s)) // Testing

module.exports = getOrdersId;
