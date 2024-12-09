/* eslint-disable prettier/prettier */
import express from "express";
import { handlers } from "../handlers";

const router = express.Router();

/**Auth user routes */
router.route("/auth/signup").post(handlers.signUpHandler.handle_signup);
router.route("/auth/signin").post(handlers.signInHandler.handle_signin);

export default router;