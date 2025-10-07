import { prisma } from "../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const JWT_SECRET = "superman";
export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
}

export interface getUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  public static async getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  public static async createUser(payload: CreateUserPayload) {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    return await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        salt: "fdsasdfads",
      },
    });
  }
  public static async getUserToken(payload: getUserTokenPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserByEmail(email);
    if (!user) throw new Error("No user found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect Password");
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }
  public static async decodeToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }
}

export default UserService;
