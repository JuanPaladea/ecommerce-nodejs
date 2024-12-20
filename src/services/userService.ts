import usersModel from "../models/usersModel";
import User from "../types/User";
import logger from "../utils/logger";

class UserService {
  async registerUser(user: User) {
    try {
      const existingUser = await usersModel.findOne({ email: user.email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const newUser = await usersModel.create(user);
      return {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
  
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await usersModel.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async deleteUserByEmail(email: string) {
    try {
      const user = await usersModel.findOneAndDelete({ email });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export default new UserService();