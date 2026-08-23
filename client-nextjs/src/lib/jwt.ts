export interface DecodedToken {
  sub: string; // email
  username: string;
  iat: number;
  exp: number;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isTokenExpired(decoded: DecodedToken): boolean {
  return decoded.exp * 1000 < Date.now();
}