import {scryptSync, randomBytes} from 'node:crypto';

const password = process.argv[2] ?? 'password1234';
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString('hex')

console.log(`${salt}:${hash}`)