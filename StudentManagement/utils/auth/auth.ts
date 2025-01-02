import { jwtDecode } from "jwt-decode";
export const CheckAuthenticated = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decodedToken = jwtDecode(token) as JwtDecodeProps;
    // Return the decoded token values matching JwtDecodeProps
    return decodedToken ? true : false;
  } catch (error) {
    return false;
  }
};

interface JwtDecodeProps {
  UserName: string;
  Role: string;
  UserId: string;
}

export const getUserFromToken = (): JwtDecodeProps | null => {
  const token = sessionStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token) as JwtDecodeProps;

    // Return the decoded token values matching JwtDecodeProps
    return decodedToken;
  } catch (error) {
    return null;
  }
};

import { parse, serialize } from "cookie"; // To parse cookies
import { ServerResponse } from "http";

function setTokenCookie(res : ServerResponse, token : string) {
  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, 
    path: '/', 
  });
  res.setHeader('Set-Cookie', cookie);
}
