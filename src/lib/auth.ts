import { cookies } from 'next/headers';
import { authenticateAdmin } from './db';

const SESSION_COOKIE_NAME = 'tentangitah_admin_session';
const SESSION_SECRET = 'itah-secret-session-key-2026'; // Simple signature key

// Function to generate a simple signed token
function generateSessionToken(username: string): string {
  const expiry = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
  const payload = `${username}:${expiry}`;
  // A simple signature (in production, use JWT or proper encryption)
  const signature = btoa(payload + SESSION_SECRET);
  return `${payload}:${signature}`;
}

// Function to verify the session token
function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split(':');
    if (parts.length !== 3) return false;
    const [username, expiryStr, signature] = parts;
    const expiry = parseInt(expiryStr, 10);
    
    if (Date.now() > expiry) return false;
    
    const payload = `${username}:${expiry}`;
    const expectedSignature = btoa(payload + SESSION_SECRET);
    
    return signature === expectedSignature && username === 'admin@tentangitah.id';
  } catch {
    return false;
  }
}

export async function loginAdmin(username: string, passwordSecret: string): Promise<boolean> {
  const admin = await authenticateAdmin(username, passwordSecret);
  if (!admin) return false;

  const token = generateSessionToken(username);
  
  // Set HttpOnly, Secure, SameSite=Lax cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return true;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!tokenCookie || !tokenCookie.value) return false;

  return verifySessionToken(tokenCookie.value);
}
