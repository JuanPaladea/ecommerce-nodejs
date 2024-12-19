import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

const isOwner = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  if (userId !== req.user._id) {
    return res.status(403).send({ message: "Forbidden" });
  }

  next();
}

export default isOwner;