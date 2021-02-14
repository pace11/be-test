const Hapi = require("@hapi/hapi");
const { sequelize, User, Products } = require("./models");
// const { uuid } = require("./utils");

const init = async () => {
  const server = Hapi.server({
    port: 6100,
    host: "localhost",
    routes: { cors: true },
  });

  await sequelize.authenticate();
  console.log("database connected");

  server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      let response = {
        statusCode: 200,
        error: false,
        message: "Ok",
        data: [],
      };
      try {
        response.message = "Welcome to the API Jubelio TEST";
        return response;
      } catch (error) {
        console.log("Error users ===>", error);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/users",
    handler: async (request, h) => {
      let response = {
        statusCode: 200,
        error: false,
        message: "Ok",
        data: [],
      };
      try {
        const users = await User.findAll();
        response.data = users;
        return response;
      } catch (error) {
        console.log("Error users ===>", error);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/products",
    handler: async (request, h) => {
      let response = {
        statusCode: 200,
        error: false,
        message: "Ok",
        data: [],
      };
      try {
        const products = await Products.findAll();
        response.data = products;
        return response;
      } catch (error) {
        console.log("Error users ===>", error);
      }
    },
  });

  server.route({
    method: "GET",
    path: "/product/{uuid}",
    handler: async (request, h) => {
      let response = {
        statusCode: 200,
        error: false,
        message: "Ok",
        data: [],
      };
      try {
        const { uuid } = request.params;
        const product = await Products.findOne({
          where: { uuid },
          includes: "products",
        });
        if (product === null) {
          response.statusCode = 404;
          response.error = true;
          response.message = "Not found";
          response.data = null;
        } else {
          response.data = product;
        }
        return response;
      } catch (error) {
        console.log("Error users ===>", error);
      }
    },
  });

  server.route({
    method: "PATCH",
    path: "/product/{uuid}",
    handler: async (request, h) => {
      let response = {
        statusCode: 200,
        error: false,
        message: "Ok",
        data: [],
      };
      try {
        const { name, description, sku_no, price, qty } = request.payload;
        const { uuid } = request.params;
        const product = await Products.findOne({
          where: { uuid },
          includes: "products",
        });

        {
          name && (product.name = name);
        }
        {
          description && (product.description = description);
        }
        {
          sku_no && (product.sku_no = sku_no);
        }
        {
          price && (product.price = parseInt(price));
        }
        {
          qty && (product.qty = parseInt(qty));
        }

        await product.save();

        response.data = product;
        return response;
      } catch (error) {
        console.log("Error users ===>", error);
      }
    },
  });

  server.route({
    method: "DELETE",
    path: "/product/delete/{uuid}",
    handler: async (request, h) => {
      let response = {
        statusCode: 200,
        error: false,
        message: "Ok",
        data: [],
      };
      try {
        const { uuid } = request.params;
        const product = await Products.destroy({
          where: { uuid },
          includes: "products",
        });
        if (product === 1) {
          return response;
        }
      } catch (error) {
        console.log("Error users ===>", error);
      }
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
