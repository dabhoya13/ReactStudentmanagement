import { jwtDecode } from "jwt-decode";
export const CheckAuthenticated = (): boolean => {
  const token = sessionStorage.getItem("token");
  if(!token) return false;
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
