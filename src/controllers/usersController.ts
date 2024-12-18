import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userService from "../services/userService";
import logger from "../utils/logger";
import { JWT_SECRET } from "../config/envs";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: "Missing required information" });
  }  

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await userService.registerUser({
      name,
      email,
      password: hashedPassword
    });
    res.status(201).send(newUser);
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message})
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Missing required information" });
  }

  try {
    const user = await userService.getUserByEmail(email);
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    (req as any).user = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role
    }, JWT_SECRET, {
      expiresIn: '1h'
    });

    // set token to cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

    res.status(200).send({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })
  res.status(200).send({ message: "Logout successful" });
}
  
