//symmetric encryption
import fs from "fs";
import crypto from "crypto";
import { ec as EC } from "elliptic";
import { BN } from "bn.js";
import CryptoJS from "crypto-js";
import * as jose from 'jose';

const ec = new EC("secp256k1");
var key = ec.genKeyPair();




//generate session key
export function generateSessionKey() {
  // Generate 256-bit (32-byte) random key
  const sessionKey = CryptoJS.lib.WordArray.random(32);

  // Convert to Base64 for easier storage/transmission
  const sessionKeyBase64 = CryptoJS.enc.Base64.stringify(sessionKey);

  console.log("Generated session key:", sessionKeyBase64);
  console.log("key 2:", sessionKey.toString(CryptoJS.enc.Base64));
  return sessionKey.toString(CryptoJS.enc.Base64);
  // return sessionKeyBase64;
}

//encrypt file
/**
 * Encrypts a file (as ArrayBuffer/Blob) using AES-256-CBC
 * @param {ArrayBuffer} fileData - Raw file data
 * @param {string} sessionKeyBase64 - Base64-encoded AES key
 * @returns {Object} { iv: string, ciphertext: string }
 */
export async function encryptFile(fileData, sessionKeyBase64) {
  // Convert Base64 key back to CryptoJS format
  const key = CryptoJS.enc.Base64.parse(sessionKeyBase64);

  // Generate a random IV (Initialization Vector)
  const iv = CryptoJS.lib.WordArray.random(16); // 128-bit IV for AES-CBC

  // Convert file data to CryptoJS WordArray
  const fileWordArray = CryptoJS.lib.WordArray.create(new Uint8Array(fileData));

  // Encrypt with AES-256-CBC
  const encrypted = CryptoJS.AES.encrypt(fileWordArray, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    iv: iv.toString(CryptoJS.enc.Base64), // IV is needed for decryption
    ciphertext: encrypted.toString(), // Base64-encoded encrypted file
  };
}

//decryption of file
export function decryptFile() {
  const decrypted = CryptoJS.AES.decrypt(
    "eWuJdcVoLpXCC+K9l4MUGw==",
    CryptoJS.enc.Base64.parse("j5FOz+WCUOYJeHSu7zH/pAXF7clmiKvoPIayghz16J4="),
    {
      iv: CryptoJS.enc.Base64.parse("IgpqiJqhs7x3GQUp38Nmug=="),
      mode: CryptoJS.mode.CBC,
    }
  );
  console.log("Test decryption:", decrypted.toString(CryptoJS.enc.Utf8));
}
// export function decryptFile(ciphertextBase64, ivBase64, sessionKeyBase64) {
//   // Input validation
//   if (!ciphertextBase64 || !ivBase64 || !sessionKeyBase64) {
//     throw new Error('Missing required decryption parameters');
//   }

//   try {
//     // 1. Parse key and IV
//     const key = CryptoJS.enc.Base64.parse(sessionKeyBase64);
//     const iv = CryptoJS.enc.Base64.parse(ivBase64);

//     // 2. Decrypt
//     const decrypted = CryptoJS.AES.decrypt(ciphertextBase64, key, {
//       iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7
//     });

//     // 3. Convert to ArrayBuffer (optimized version)
//     const latin1 = decrypted.toString(CryptoJS.enc.Latin1);
//     const buffer = new ArrayBuffer(latin1.length);
//     new Uint8Array(buffer).set(
//       latin1.split('').map(c => c.charCodeAt(0))
//     );

//     return buffer;
//   } catch (error) {
//     console.error('Decryption error:', error);
//     throw new Error('Failed to decrypt file. Invalid key or corrupted data.');
//   }
// }

// Initialize curve (e.g., 'secp256k1', 'p256', etc.)

const G = ec.g; // base point
const order = ec.n; // order of the curve

// export function encryptFile(key, filename) {
//   // Convert the key (a string or Buffer) to a usable encryption key and IV
//   const algorithm = 'aes-256-cbc';
//   const iv = crypto.randomBytes(16); // Initialization vector

//   // Ensure the key is a 32-byte Buffer
//   const encryptionKey = crypto.createHash('sha256').update(String(key)).digest();

//   const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

//   // Read the original file
//   const originalData = fs.readFileSync(filename);

//   // Encrypt the data
//   let encrypted = cipher.update(originalData);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);

//   // Save the IV with the encrypted data (prepend IV to encrypted data)
//   const encryptedWithIv = Buffer.concat([iv, encrypted]);

//   // Write the encrypted file
//   fs.writeFileSync(filename, encryptedWithIv);

//   console.log('File encrypted successfully.');
// }

//symmetric decryption

// export function decryptFile(filename, key) {
//   const algorithm = 'aes-256-cbc';

//   // Ensure the key is a 32-byte Buffer
//   const encryptionKey = crypto.createHash('sha256').update(String(key)).digest();

//   // Read the encrypted file
//   const encryptedData = fs.readFileSync(filename);

//   // Extract the IV from the beginning of the file (first 16 bytes)
//   const iv = encryptedData.slice(0, 16);
//   const encryptedContent = encryptedData.slice(16);

//   const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);

//   // Decrypt the data
//   let decrypted = decipher.update(encryptedContent);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);

//   // Write the decrypted data back to the file
//   fs.writeFileSync(filename, decrypted);

//   console.log('File decrypted successfully.');
// }

export function asymmetricEncryption(pubKey, message) {
  // pubKey is an EC point
  // message is an integer (Number or BN)

  const k = new BN(ec.rand().toArrayLike(Buffer)).umod(order); // random scalar < order

  const C1 = G.mul(k); // k * G
  const H = pubKey.mul(k); // k * pub_key
  const Hy = H.getY(); // y-coordinate of H

  const msgBN = new BN(message);
  const C2 = msgBN.add(Hy).umod(order); // C2 = (message + H.y) % order

  return { C1, C2 };
}

export const reconstructKey = (subSecretShare, t) => {
  if (subSecretShare.length < t) {
    throw new Error("Insufficient shares to reconstruct the key.");
  }

  let reconKey = 0;

  for (let j = 1; j <= t; j++) {
    let mult = 1;

    for (let h = 1; h <= t; h++) {
      if (h !== j) {
        mult *= h / (h - j);
      }
    }

    reconKey += (subSecretShare[j - 1] * Math.floor(mult)) % order;
  }

  return reconKey % order;
};

export function asymmetricDecryption(secKey, cipher) {
  const { C1, C2 } = cipher;

  // Compute H = secKey * C1
  const H = C1.mul(secKey);

  // Compute the original message
  const message = C2.sub(H.getY()).umod(order);

  return message;
}

export function signatureVerification(facultyPublicKey, r, s, message) {
  // Hash the message using SHA-256
  const h = BigInt(
    "0x" + crypto.createHash("sha256").update(message).digest("hex")
  );

  // Compute w = s^(-1) mod p
  const w = s.invm(p);

  // Compute u1 = (h * w) % p and u2 = (r * w) % p
  const u1 = h.mul(w).umod(p);
  const u2 = r.mul(w).umod(p);

  // Compute P = u1 * G + u2 * facultyPublicKey
  const P = G.mul(u1).add(facultyPublicKey.mul(u2));

  // Compute rx = P.x % p
  const rx = P.getX().umod(p);

  console.log("R' =", rx.toString());

  // Return true if rx equals r, false otherwise
  return rx.eq(r);
}

export function signatureGeneration(facultyPrivateKey, message) {
  // Hash the message using SHA-256
  const h = BigInt(
    "0x" + crypto.createHash("sha256").update(message).digest("hex")
  );

  // Generate a random scalar k
  const k = BigInt(ec.genKeyPair().getPrivate().toString(10)) % p;

  // Compute R = k * G
  const R = G.mul(k);

  // Compute r = R.x % p
  const r = R.getX().umod(p);

  // Compute the modular inverse of k
  const invK = k.invm(p);

  // Compute s = ((h + facultyPrivateKey * r) * invK) % p
  const s = h.add(facultyPrivateKey.mul(r)).mul(invK).umod(p);

  return { r, s };
}

export function generatePolynomialAndCommitments(t, constantTerm) {
  // Generate random coefficients for the polynomial
  const coefficients = [constantTerm];
  for (let i = 1; i < t; i++) {
    coefficients.push(BigInt(Math.floor(Math.random() * Number(order))));
  }

  // Generate commitments for each coefficient
  const commitments = coefficients.map((coeff) => G.mul(coeff));

  return { coefficients, commitments };
}

export function evaluatePolynomial(coefficients, x) {
  let result = BigInt(0);

  coefficients.forEach((coeff, i) => {
    result += coeff * BigInt(x) ** BigInt(i);
  });

  return result % order;
}

// export function generateSessionKey(){
//   console.log("session key generated");
// }
export function encryptPaper() {
  console.log("paper encrypted");
}
export function encryptSessionKey(sessionKey) {
  //fetch public key from backend
  let C1,
    C2 = asymmetricEncryption(pubKey, sessionKey);
}
export function decryptPaper() {
  console.log("paper decrypted");
}
export function decryptSessionKey() {
  console.log("session key encrypted");
}
export function signPaper() {
  console.log("paper signed");
}
export function verifyPaper() {
  console.log("paper verified");
}

// function stringToUint8Array(str) {
//   const bytes = [];
//   for (let i = 0; i < str.length; i++) {
//     bytes.push(str.charCodeAt(i));
//   }
//   return new Uint8Array(bytes);
// }

export async function generateKeyPair() {
  const key = ec.genKeyPair();
  const pubKey = key.getPublic('hex');
  const privKey = key.getPrivate('hex');

  const pubArray = Uint8Array.fromHex(pubKey); 
  const privArray = Uint8Array.fromHex(privKey);

  const privateJwk = await jose.exportJWK(pubArray)
  const publicJwk = await jose.exportJWK(privArray)

  console.log(privateJwk)
  console.log(publicJwk)
  

}
