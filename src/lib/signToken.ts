"use server";

import { JwtPayload, sign } from "jsonwebtoken";
export interface CustomJwtPayload extends JwtPayload {
  name: string;
  email: string;
  password: string; 
};
/**
 * A function that accepts three parameters name, email,password and then converts them into jwt token
 * @param name 
 * @param email 
 * @param password 
 * @returns
 */
export async function signToken(name: string, email: string, password: string) {
  return sign({ name, email, password }, `${process.env.JWT_SECRET}`, {
    expiresIn: "24h",
  });
}
