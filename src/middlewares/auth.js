import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envs";
import logger from "../utils/logger";

const auth = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    logger.error('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Failed to authenticate token');
    return res.status(401).json({ message: 'Failed to authenticate token' });
  }
}

export default auth;