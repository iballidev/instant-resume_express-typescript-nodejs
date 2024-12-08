/* eslint-disable prettier/prettier */
import express from "express";

const handle_signin = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send("Hello world!");

  next();
};

export default {
  handle_signin,
};
