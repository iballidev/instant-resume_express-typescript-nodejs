/* eslint-disable prettier/prettier */
import http from 'http';
import cors from 'cors';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config({ path: path.join(__dirname, '../.env') });
// import { handleError } from './helpers/error';
import httpLogger from './middlewares/http-logger';
import router from './routes/index';
import ApiRouter from './app-api/routes/index';
import { errorHandler } from './middlewares/error-handler';
import corsOptions from './config/cors-options';

const app: express.Application = express();


/**DB Connection */
import('./config/db');

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Enable CORS
app.use(cors(corsOptions));

app.use('/', router);

/**api routes */
app.use('/api', ApiRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
// const errorHandler: express.ErrorRequestHandler = (err, _req, res) => {
//   console.log('Error***: ', err.message);
//   handleError(err, res);
// };
app.use(errorHandler);

const port = process.env.PORT || '7000';
app.set('port', port);

const server = http.createServer(app);

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.info(`Server is listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
