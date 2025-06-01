/* eslint-disable @typescript-eslint/no-require-imports */
import * as crypto from 'crypto';

// Polyfill for crypto in environments where it might not be fully available
if (typeof global.crypto === 'undefined') {
  (global.crypto as any) = {
    getRandomValues: function (buffer: Uint8Array): Uint8Array {
      return crypto.randomFillSync(buffer);
    },
    subtle: crypto.webcrypto?.subtle,
    randomUUID: function (): string {
      return crypto.randomUUID
        ? crypto.randomUUID()
        : crypto.randomBytes(16).toString('hex');
    },
  };
} else if (!global.crypto.subtle && crypto.webcrypto?.subtle) {
  (global.crypto as any).subtle = crypto.webcrypto.subtle;

  if (!(global.crypto as any).randomUUID) {
    (global.crypto as any).randomUUID = function (): string {
      return crypto.randomUUID
        ? crypto.randomUUID()
        : crypto.randomBytes(16).toString('hex');
    };
  }
}

if (!crypto.randomUUID) {
  (crypto as any).randomUUID = function (): string {
    return crypto.randomBytes(16).toString('hex');
  };
}

(global as any).TextEncoder = global.TextEncoder || require('util').TextEncoder;
(global as any).TextDecoder = global.TextDecoder || require('util').TextDecoder;

jest.setTimeout(30000);
