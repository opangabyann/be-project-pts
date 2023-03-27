const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs')
const multer = require('multer');
require('dotenv').config();
const port = process.env.PORT || 1313;
const {sequelize} = require("./src/models")
const routers = require('./src/routers/index')
const log = require('./src/middleware/log');
const notFound = require('./src/middleware/404');
const errorHandling = require('./src/middleware/errorHandling');
const authMiddleware = require('./src/middleware/auth');
const Log2Middleware = require('./src/middleware/log2');
const Log1Middleware = require('./src/middleware/log1');
const paginationMiddleware = require('./src/middleware/paginationMiddleware');
const cors = require ('cors')
const app = express();
// const port = 8080;

// app.use(bodyParser.json());
// app.use(authMiddleware)
app.use(express.json())
app.use(express.static("src/storage/uploads"))
app.use(cors())
app.use(Log2Middleware)
app.use(Log1Middleware)
app.use(log);
app.use(paginationMiddleware)
app.use(routers);
app.use(errorHandling);
app.use(notFound);

// app.listen(port, () =>
//   console.log(`Server berjalan di http://localhost:${port}`)
// );

app.listen(port, async() => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }    
  return console.log(`Server berjalan di http://localhost:${port}`);
});
