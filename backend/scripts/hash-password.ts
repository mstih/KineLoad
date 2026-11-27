import { hashPassword, verifyPassword } from '../src/lib/password';

const hash = await hashPassword('demo1234');

console.log('hash:', hash);
console.log('demo1234 →', await verifyPassword('demo1234', hash));
console.log('wrongpass →', await verifyPassword('wrongpass', hash));