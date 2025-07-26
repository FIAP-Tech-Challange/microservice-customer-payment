import { pbkdf2Sync } from 'node:crypto';

export function encodeString(input: string, salt: string): string {
  return pbkdf2Sync(input, salt, 100_000, 64, 'sha512').toString('hex');
}
