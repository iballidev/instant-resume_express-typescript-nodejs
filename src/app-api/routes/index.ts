/* eslint-disable prettier/prettier */
import express from "express";
import { handlers } from "../handlers";

const router = express.Router();

/**Auth user routes */
router.route("/auth/signup").post(handlers.authHandlers.handle_signup);

export default router;