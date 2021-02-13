const Hapi = require("@hapi/hapi");
const { Pool } = require("pg");
const parse = require("xml2js");
const fetch = require("node-fetch");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jubelio_test",
  password: "12345",
  port: 5432,
});

const init = async () => {
  const server = Hapi.server({
    port: 6100,
    host: "localhost",
  });

  server.route({
    method: "get",
    path: "/products",
    handler: async (request, h) => {
      let response = {
        statusCode: 200,
        error: false,
        message: "Ok",
        data: [],
      };
      let query = await pool.query("SELECT * FROM products");
      response.data = query.rows;
      return response;
    },
  });

  server.route({
    method: "get",
    path: "/api",
    handler: async (request, h) => {
      let allProductId = [];
      let response = {
        status_code: 200,
        error: null,
        status_message: "Ok",
        data: [],
      };
      const options = {
        method: "GET",
        headers: {
          openapikey: "721407f393e84a28593374cc2b347a98",
        },
      };
      const fetch_response = await fetch(
        `http://api.elevenia.co.id/rest/prodservices/product/listing?page=1`,
        options
      );
      const data = await fetch_response;
      const products = await data.text();
      parse.parseString(products, (err, result) => {
        let item = result.Products.product;
        for (let i = 0; i < item.length; i += 1) {
          allProductId.push(item[i].prdNo[0]);
        }
      });
      if (allProductId.length > 0) {
        for (let j = 0; j < allProductId.length; j += 1) {
          const fetch_product_detail = await fetch(
            `http://api.elevenia.co.id/rest/prodservices/product/details/${allProductId[j]}`,
            options
          );
          const data_detail = await fetch_product_detail;
          const product = await data_detail.text();
          parse.parseString(product, (err, result) => {
            response.data.push(result.Product);
          });
        }
      }
      return response;
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
