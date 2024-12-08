/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import express from 'express';
import winston from 'winston';

export const errorHandler = (err: any, _req: express.Request, res: express.Response, next:express.NextFunction) => {
    console.log('Error***: ', err.message);
    winston.error(err.message, err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Something went wrong',
        },
    });
    next();
};