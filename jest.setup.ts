/* eslint-disable @typescript-eslint/no-require-imports */
import * as crypto from 'crypto';

// Polyfill for crypto in environments where it might not be fully available
if (typeof global.crypto === 'undefined') {
  (global.crypto as any) = {
    getRandomValues: function (buffer: Uint8Array): Uint8Array {
      return crypto.randomFillSync(buffer);
    },
    subtle: crypto.webcrypto?.subtle,
  };
} else if (!global.crypto.subtle && crypto.webcrypto?.subtle) {
  (global.crypto as any).subtle = crypto.webcrypto.subtle;
}

(global as any).TextEncoder = global.TextEncoder || require('util').TextEncoder;
(global as any).TextDecoder = global.TextDecoder || require('util').TextDecoder;

jest.setTimeout(30000);
