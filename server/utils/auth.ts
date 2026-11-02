import type { H3Event } from "h3";
import { createError, deleteCookie, getCookie, setCookie } from "h3";
import { createHash, randomBytes } from "node:crypto";
import { db } from "./db";

const COOKIE_NAME = "technovation_admin_session";
const SESSION_DAYS = 1;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAdminSession(event: H3Event, adminId: number) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.session.create({ data: { tokenHash, adminId, expiresAt } });

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearAdminSession(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME);
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  deleteCookie(event, COOKIE_NAME, { path: "/" });
}

export async function getAdminFromSession(event: H3Event) {
  const token = getCookie(event, COOKIE_NAME);
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = await db.session.findUnique({
    where: { tokenHash },
    include: { admin: true },
  });

  
if (!session) return null;

if (!session.admin.isActive) {
  await db.session.deleteMany({
    where: { adminId: session.adminId },
  });

  deleteCookie(event, COOKIE_NAME, { path: "/" });
  return null;
}

  if (session.expiresAt <= new Date()) {
    await db.session.delete({ where: { tokenHash } }).catch(() => undefined);
    deleteCookie(event, COOKIE_NAME, { path: "/" });
    return null;
  }

  return session.admin;
}

export async function requireAdmin(event: H3Event) {
  const admin = await getAdminFromSession(event);
  if (!admin)
    throw createError({
      statusCode: 401,
      statusMessage: "Admin login required",
    });
  return admin;
}
