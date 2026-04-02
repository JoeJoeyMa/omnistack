import { verifyPassword as verifyLegacyScryptPassword } from "better-auth/crypto";

const PBKDF2_PREFIX = "pbkdf2";
const PBKDF2_DIGEST = "SHA-256";
const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_KEY_BYTES = 32;
const PBKDF2_SALT_BYTES = 16;
const loopbackHosts = new Set(["127.0.0.1", "::1", "0.0.0.0", "localhost"]);

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(value: string) {
  if (value.length % 2 !== 0) {
    throw new Error("Invalid hex value.");
  }

  const bytes = new Uint8Array(value.length / 2);

  for (let index = 0; index < value.length; index += 2) {
    bytes[index / 2] = Number.parseInt(value.slice(index, index + 2), 16);
  }

  return bytes;
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;

  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }

  return diff === 0;
}

function toArrayBuffer(view: Uint8Array) {
  return view.buffer.slice(
    view.byteOffset,
    view.byteOffset + view.byteLength,
  ) as ArrayBuffer;
}

async function derivePbkdf2Key(
  password: string,
  salt: Uint8Array,
  iterations: number,
) {
  const passwordBytes = new TextEncoder().encode(password.normalize("NFKC"));
  const passwordBuffer = toArrayBuffer(passwordBytes);
  const saltBuffer = toArrayBuffer(salt);
  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      hash: PBKDF2_DIGEST,
      iterations,
      name: "PBKDF2",
      salt: saltBuffer,
    },
    importedKey,
    PBKDF2_KEY_BYTES * 8,
  );

  return new Uint8Array(derivedBits);
}

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".");

  if (parts.length !== 4) {
    return false;
  }

  const octets = parts.map((part) => Number.parseInt(part, 10));

  if (octets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
    return false;
  }

  const [first, second] = octets;

  return (
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

export function isLocalPasswordRuntime(origin: string) {
  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();

    return loopbackHosts.has(hostname) || isPrivateIpv4(hostname);
  } catch {
    return false;
  }
}

export async function hashUserPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(PBKDF2_SALT_BYTES));
  const derivedKey = await derivePbkdf2Key(password, salt, PBKDF2_ITERATIONS);

  return [
    PBKDF2_PREFIX,
    PBKDF2_DIGEST.toLowerCase(),
    PBKDF2_ITERATIONS.toString(),
    bytesToHex(salt),
    bytesToHex(derivedKey),
  ].join("$");
}

type VerifyUserPasswordOptions = {
  allowLegacyScrypt: boolean;
  hash: string;
  password: string;
};

export async function verifyUserPassword({
  allowLegacyScrypt,
  hash,
  password,
}: VerifyUserPasswordOptions) {
  if (!hash.startsWith(`${PBKDF2_PREFIX}$`)) {
    if (!allowLegacyScrypt) {
      return false;
    }

    return verifyLegacyScryptPassword({ hash, password });
  }

  const [prefix, digest, iterationsRaw, saltHex, keyHex] = hash.split("$");

  if (
    prefix !== PBKDF2_PREFIX ||
    digest !== PBKDF2_DIGEST.toLowerCase() ||
    !iterationsRaw ||
    !saltHex ||
    !keyHex
  ) {
    return false;
  }

  const iterations = Number.parseInt(iterationsRaw, 10);

  if (!Number.isInteger(iterations) || iterations <= 0) {
    return false;
  }

  const salt = hexToBytes(saltHex);
  const expectedKey = hexToBytes(keyHex);
  const derivedKey = await derivePbkdf2Key(password, salt, iterations);

  return timingSafeEqual(derivedKey, expectedKey);
}
