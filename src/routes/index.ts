/* eslint-disable prettier/prettier */
import express from 'express';
// import { healthCheck } from 'src/handlers/healthcheck';
// import logger from '../utils/logger';
// import {healthCheck} from '../handler/healthCheck'
import { healthCheck } from '../handlers/healthcheck';

const router = express.Router();

/* GET home page. */
router.get('/', healthCheck);

export default router;
