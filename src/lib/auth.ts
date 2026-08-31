import { cookies } from 'next/headers';
import { 
  authenticateAdmin, 
  getActiveSessionsCount, 
  addActiveSession, 
  removeActiveSession, 
  isSessionActive 
} from './db';

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

// Function to verify the session token structure & signature
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

export async function loginAdmin(username: string, passwordSecret: string): Promise<{ success: boolean; error?: string }> {
  const admin = await authenticateAdmin(username, passwordSecret);
  if (!admin) {
    return { success: false, error: 'Username atau password salah' };
  }

  // Enforce limit of 5 active simultaneous sessions
  const activeSessionsCount = await getActiveSessionsCount();
  if (activeSessionsCount >= 5) {
    return { 
      success: false, 
      error: 'Batas limit login tercapai. Maksimal 5 admin aktif secara bersamaan. Silakan keluar (logout) dari salah satu sesi aktif terlebih dahulu.' 
    };
  }

  const token = generateSessionToken(username);
  const parts = token.split(':');
  const signature = parts[2];
  const expiryTime = parseInt(parts[1], 10);
  const expiresAt = new Date(expiryTime).toISOString();

  // Register session in DB
  await addActiveSession(signature, username, expiresAt);
  
  // Set HttpOnly, SameSite=Lax cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (tokenCookie && tokenCookie.value) {
    const parts = tokenCookie.value.split(':');
    if (parts.length === 3) {
      const signature = parts[2];
      await removeActiveSession(signature);
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!tokenCookie || !tokenCookie.value) return false;

  const isValid = verifySessionToken(tokenCookie.value);
  if (!isValid) return false;

  // Validate active session state against DB
  const parts = tokenCookie.value.split(':');
  const signature = parts[2];
  const isActive = await isSessionActive(signature);
  
  return isActive;
}
