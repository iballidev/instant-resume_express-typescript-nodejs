/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import express from "express";
import env from "../../config/env";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";
import { ConfigPassword } from "../../helpers/config-password";

const handle_signin = async (_req: express.Request, res: express.Response, next: express.NextFunction) => {
  const data: any = _req.body;
  const { email, password } = data;
  const envRefreshToken: string | any = env.REFRESH_TOKEN_SECRET ? env.REFRESH_TOKEN_SECRET : env.REFRESH_TOKEN_SECRET;
  const envAccessToken: string | any = env.ACCESS_TOKEN_SECRET ? env.ACCESS_TOKEN_SECRET : env.ACCESS_TOKEN_SECRET;

  console.log({ email, password });

  try {
    await userModel.ValidateUser.validateAsync({ email, password });

    /**check for duplicate */
    const foundUser: any = await userModel.User.findOne({ email: email });
    if (!foundUser) {
      return res.status(401).json({
        message: "Auth failed",
        formData: email,
      });
    }

    const config_password = new ConfigPassword(password, foundUser.password);
    const match = await config_password.match();

    if (!match) {
      res.status(404).json({
        message: "Auth failed!",
        formData: email,
      });
    }

    if (match) {
      const roles: any = Object.values(foundUser.roles).filter(Boolean);
      /**Create JWT */
      let accessToken = "";
      if (!data.rememberMe) {
        accessToken = jwt.sign(
          {
            userInfo: {
              name: foundUser.name,
              email: foundUser.email,
              user_id: foundUser._id,
              roles: roles,
            },
          },
          env.ACCESS_TOKEN_SECRET ? env.ACCESS_TOKEN_SECRET : "",
          // { expiresIn: "1hr" }
          { expiresIn: 15 },
        );
      } else {
        accessToken = jwt.sign(
          {
            userInfo: {
              name: foundUser.name,
              email: foundUser.email,
              user_id: foundUser._id,
              roles: roles,
            },
          },
          envAccessToken,
          { expiresIn: "7d" },
          // { expiresIn: 60 }
        );
      }

      const refreshToken = jwt.sign({ email: foundUser.email }, envRefreshToken, { expiresIn: "1d" });

      /**Saving refreshToken with current user */
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      /**Creates Secure Cookie with refresh token */
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure:
          false /**Only serve on https i.e for production only*/ /** make it false if you are use VSCode Thunder Client*/ /**Without it, jwt disappears in Angular application too */,
        // sameSite: "None",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ roles, accessToken });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export default {
  handle_signin,
};
