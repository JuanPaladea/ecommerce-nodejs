import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ message: 'Unauthorized' });
  }

  next();
}

export default isAdmin;