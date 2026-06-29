const COOKIE_NAME = "portfolio_admin";

function secret() {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-secret";
}

function username() {
  return process.env.ADMIN_USERNAME ?? "admin";
}

function password() {
  return process.env.ADMIN_PASSWORD ?? "change-me";
}

async function hmacHex(input: string) {
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(input));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAuthCookie(user: string) {
  const signature = await hmacHex(user);
  return `${user}.${signature}`;
}

export async function verifyAuthCookie(cookieValue: string) {
  const [user, signature] = cookieValue.split(".");
  if (!user || !signature) return false;
  if (user !== username()) return false;
  return signature === (await hmacHex(user));
}

export function validateCredentials(inputUsername: string, inputPassword: string) {
  return inputUsername === username() && inputPassword === password();
}

export function authCookieName() {
  return COOKIE_NAME;
}
