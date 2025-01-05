"use server";

import { JwtPayload, sign } from "jsonwebtoken";
export interface CustomJwtPayload extends JwtPayload {
  name: string;
  email: string;
  password: string; 
};
export async function signToken(name: string, email: string, password: string) {
  return sign({ name, email, password }, `${process.env.JWT_SECRET}`, {
    expiresIn: "24h",
  });
}
