import crypto from "crypto";

const COOKIE_NAME = "tei_admin_session";

function sign(value) {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret";
  const hmac = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verify(signed) {
  if (!signed) return false;
  const [value, hmac] = signed.split(".");
  if (!value || !hmac) return false;
  const expected = sign(value).split(".")[1];
  return hmac === expected && value === "ok";
}

export function makeSessionCookieValue() {
  return sign("ok");
}

export function isValidSessionCookie(cookieValue) {
  return verify(cookieValue);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
