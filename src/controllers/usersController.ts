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
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  if (!email.match(emailRegex)) {
    return res.status(400).send({ message: "Invalid email" });
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({ message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await userService.registerUser({
      name,
      email,
      password: hashedPassword
    });
    res.status(201).send('User registered successfully');
  } catch (error: any) {
    logger.error(error);
    res.status(400).send({ message: error.message})
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Missing required information" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
  if (!email.match(emailRegex)) {
    return res.status(400).send({ message: "Invalid email" });
  }

  try {
    const user = await userService.getUserByEmail(email);
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    (req as any).user = {
      _id: user._id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign({
      _id: user._id,
      email: user.email,
      role: user.role
    }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

    res.status(200).send({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
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

export const deleteUser = async (req: Request & { user: { email: string } }, res: Response) => {
  const { email } = req.user;

  try {
    await userService.deleteUserByEmail(email);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error: any) {
    logger.error(error);
    res.status(500).send({ message: error.message });
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  (req as any).user = null;
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })
  res.status(200).send({ message: "Logout successful" });
}
