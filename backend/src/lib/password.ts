import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

// Hash a normal text password with a random salt using scrypt.
// Returns salt:hash.
export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derived.toString('hex')}`;
}

// Verify a password with a stored salt:hash
// Returns true if it matches, false otherwise.
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    if (typeof stored !== 'string') return false;

    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;

    try {
        const derived = (await scryptAsync(password, salt, 64)) as Buffer;
        const expected = Buffer.from(hash, 'hex');
        if (expected.length !== derived.length) return false;
        // Apparently it can prevent attacks while comparing - not sure
        return timingSafeEqual(derived, expected);
    } catch {
        return false;
    }
}