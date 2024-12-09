/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import express from "express";
import userModel from "../models/user.model";
import bcrypt from "bcryptjs";

const handle_signup = async (_req: express.Request, res: express.Response, next:express.NextFunction) => {
  const { name, email, password } = _req.body;
  console.log({ name, email, password });

  try {
    /**validate credentials */
    await userModel.ValidateUser.validateAsync({
      email, password
    });

    /**check for duplicate */
    const foundUser = await userModel.User.findOne({ email: email });
    if (foundUser) {
      return res.status(409).json({
        message: 'User already exist!',
        formDAta: email,
      });
    }


    /**save data */
    // encrypt the password
    const hashPwd = await bcrypt.hash(password, 10);

    // create and store new user
    const result = await userModel.User.create({
      name: name,
      email: email,
      password: hashPwd,
    });

    if (result) {
      return res.status(201).json({
        message: `Account created for ${email}`,
      });
    }

  } catch (error: any) {
    // console.log("Error=>: ", error);
    // console.log("Error message=>: ", error.message);
    next(error);
  }
};

export default {
  handle_signup,
};
