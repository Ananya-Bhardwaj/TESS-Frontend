//symmetric encryption
import fs from "fs";
import crypto from "crypto";
import { ec } from "elliptic";
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

  return sessionKey.toString(CryptoJS.enc.Base64);
  // return sessionKeyBase64;
}

export const symmtericEncryption = async (selectedFile) => {
  try {
    const sessionKey = generateSessionKey();
    
    // 1. Read file data
    const fileData = await selectedFile.arrayBuffer();

    // 2. Convert to CryptoJS WordArray
    const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(fileData));

    // 3. Encrypt
    const encrypted = CryptoJS.AES.encrypt(wordArray, sessionKey, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    
    const ciphertext = encrypted.toString();
    const ivBase64 = encrypted.iv.toString(CryptoJS.enc.Base64);

    const encryptedData = {
      ciphertext,
      iv: ivBase64,
      filename: selectedFile.name
    };

    return encryptedData; 
  }
  catch (err){
    console.log(err)
  }
}

export async function sign(ciphertext){
  const hashedCiphertext = await hashCiphertext(ciphertext); 

  // const hashedCiphertext = await Promise.resolve(hash);

  // 1. Generate Key Pair
  const keyPair = ec.genKeyPair();
  const privKey = keyPair.getPrivate('hex');
  const pubKey = keyPair.getPublic('hex');
  
  // 2. Sign the Hash
  const signature = keyPair.sign(hashedCiphertext, 'hex', {
    canonical: true,
  });
  const derSignature = signature.toDER('hex');
  
  return derSignature; 
}


// const G = ec.g; // base point
// const order = ec.n; // order of the curve

export async function hashCiphertext(ciphertext) {
  // Convert Base64 ciphertext to ArrayBuffer
  const binaryString = atob(ciphertext);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const hashHex = CryptoJS.SHA256(bytes);
  
  return hashHex.toString(CryptoJS.enc.Hex); 
}


//ananya ka code
// export function asymmetricEncryption(pubKey, message) {
//   // pubKey is an EC point
//   // message is an integer (Number or BN)

//   const k = new BN(ec.rand().toArrayLike(Uint8Array)).umod(order); // random scalar < order

//   const C1 = G.mul(k); // k * G
//   const H = pubKey.mul(k); // k * pub_key
//   const Hy = H.getY(); // y-coordinate of H

//   const msgBN = new BN(message);
//   const C2 = msgBN.add(Hy).umod(order); // C2 = (message + H.y) % order

//   return { C1, C2 };
// }

// export function asymmetricEncryption(pubKey, message) {
//   console.group('🔐 Threshold Encryption Process');

//   // 1. Generate random k (browser-compatible)
//   const k = generateRandomScalar();
//   console.log('Random scalar k:', k.toString(16));
//   console.assert(k.lt(order), 'k must be less than curve order');

//   // 2. Compute C1 = k*G
//   const C1 = G.mul(k);
//   console.log('C1 point:',
//     `x: ${C1.getX().toString(16)}`,
//     `y: ${C1.getY().toString(16)}`
//   );

//   // 3. Compute H = k*pubKey
//   const H = pubKey.mul(k);
//   console.log('H point:',
//     `x: ${H.getX().toString(16)}`,
//     `y: ${H.getY().toString(16)}`
//   );
//   const Hy = H.getY();
//   console.log('H.y coordinate:', Hy.toString(16));

//   // 4. Compute C2 = (message + H.y) mod order
//   const msgBN = new BN(message);
//   console.log('Original message:', msgBN.toString());
//   const C2 = msgBN.add(Hy).umod(order);
//   console.log('C2 value:', C2.toString(16));

//   console.groupEnd();
//   return { C1, C2 };
// }

// // Browser-compatible random scalar generation
// function generateRandomScalar() {
//   // Fallback to window.crypto if available, otherwise use Math.random
//   const crypto = window.crypto || window.msCrypto;
//   let randomBytes;

//   if (crypto && crypto.getRandomValues) {
//     randomBytes = new Uint8Array(32);
//     crypto.getRandomValues(randomBytes);
//     console.log('Using crypto.getRandomValues');
//   } else {
//     console.warn('Using Math.random fallback - less secure!');
//     randomBytes = new Uint8Array(32);
//     for (let i = 0; i < 32; i++) {
//       randomBytes[i] = Math.floor(Math.random() * 256);
//     }
//   }

//   const k = new BN(randomBytes).umod(order.subn(1)); // 0 to p-2
//   console.log('Generated k:', k.toString(16));
//   return k;
// }

// // Helper to convert between formats
// export function pointFromCoordinates(x, y) {
//   return EC.curve.point(new BN(x, 16), new BN(y, 16));
// }


//THIS ONE DOES WORK BUT COMMENTING FOR NOW
// export function asymmetricEncryption(pubKeyHex, sessionKey) {
//   console.group("🔐 Threshold Encryption Process");

//   try {
//     // 1. Validate and convert inputs
//     console.log("Input session key:", sessionKey);
//     const messageBN = validateAndConvertToBN(sessionKey);
//     console.log("Converted message:", messageBN.toString());

//     // const pubKey = EC.keyFromPublic(pubKeyHex, 'hex').getPublic();
//     // console.log('Public Key:', pointToString(pubKey));

//     // 2. Parse public key (handle both compressed and uncompressed formats)
//     let pubKey;
//     try {
//       pubKey = EC.keyFromPublic(pubKeyHex, "hex").getPublic();
//     } catch (e) {
//       // If parsing fails, try prepending 04 for uncompressed format
//       pubKey = EC.keyFromPublic("04" + pubKeyHex, "hex").getPublic();
//     }
//     console.log("Public Key:", pointToString(pubKey));

//     // 2. Generate random k (0 to order-2)
//     const k = generateRandomScalar();
//     console.log("Random k:", k.toString(16));

//     // 3. Compute C1 = k*G
//     const C1 = G.mul(k);
//     console.log("C1 point:", pointToString(C1));

//     // 4. Compute H = k*pubKey
//     const H = pubKey.mul(k);
//     console.log("H point:", pointToString(H));

//     // 5. Compute C2 = (message + H.y) mod order
//     const C2 = messageBN.add(H.getX()).umod(order);
//     console.log("C2 value:", C2.toString(16));

//     console.groupEnd();
//     return {
//       C1: pointToObject(C1),
//       C2: C2.toString(16),
//     };
//   } catch (error) {
//     console.error("Encryption failed:", error);
//     throw new Error(`Encryption error: ${error.message}`);
//   }
// }

// Helper functions

export function asymmetricEncryption(pubKeyHex, sessionKey) {
  try {
    // Convert Base64 session key to BN
    const binaryStr = atob(sessionKey);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const messageBN = new BN(bytes);

    // Parse public key
    const pubKey = EC.keyFromPublic(pubKeyHex.startsWith('04') ? pubKeyHex : '04' + pubKeyHex, 'hex').getPublic();

    // Generate random k
    const k = generateRandomScalar();

    // Compute points
    const C1 = G.mul(k);
    const H = pubKey.mul(k);
    const C2 = messageBN.add(H.getX()).umod(order);

    return {
      C1: {
        x: C1.getX().toString('hex').padStart(64, '0'),
        y: C1.getY().toString('hex').padStart(64, '0')
      },
      C2: C2.toString('hex').padStart(64, '0')
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

function validateAndConvertToBN(input) {
  try {
    if (typeof input === "string") {
      // Handle hex strings
      if (input.startsWith("0x")) {
        return new BN(input.slice(2), 16);
      }
      // Handle base64 strings
      if (input.match(/^[A-Za-z0-9+/]+={0,2}$/)) {
        // Convert base64 to Uint8Array
        const binaryStr = atob(input);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        // Convert Uint8Array to BN
        let hexString = '';
        bytes.forEach(byte => {
          hexString += byte.toString(16).padStart(2, '0');
        });
        return new BN(hexString, 16);
      }
      // Handle plain number strings
      if (input.match(/^\d+$/)) {
        return new BN(input);
      }
    }
    // Handle number or BN directly
    return new BN(input);
  } catch (e) {
    throw new Error(`Invalid message format: ${input}`);
  }
}

export function computeOverallPublicKey(participantShares) {
  try {
    // 1. Sum all private key shares (mod order)
    let privateKeySum = new BN(0);
    for (const [id, share] of Object.entries(participantShares)) {
      privateKeySum = privateKeySum.add(share).umod(order);
    }

    // 2. Compute Q = (sum of shares) * G
    const overallPublicKey = G.mul(privateKeySum);

    return {
      x: overallPublicKey.getX().toString(16),
      y: overallPublicKey.getY().toString(16),
      sumOfShares: privateKeySum.toString(16), // For verification
    };
  } catch (error) {
    throw new Error(`Public key computation failed: ${error.message}`);
  }
}


//THIS TOO DOES WORK BUT COMMENTING FOR NOW
// export function asymmetricDecrypt(secKey, cipher) {
//   try {
//     // 1. Parse inputs
//     const secretKey = typeof secKey === "string" ? new BN(secKey, 16) : secKey;
//     const C1 = EC.curve.point(new BN(cipher.C1.x, 16), new BN(cipher.C1.y, 16));
//     const C2 = new BN(cipher.C2, 16);

//     // 2. Compute shared secret H = secretKey * C1
//     const H = C1.mul(secretKey);

//     // 3. Recover message BN = (C2 - H.x) mod order
//     const messageBN = C2.sub(H.getX()).umod(order);

//     // 4. Convert BN to Uint8Array (32 bytes, big-endian)
//     const messageBytes = new Uint8Array(32);
//     const hexStr = messageBN.toString(16).padStart(64, "0");

//     for (let i = 0; i < 32; i++) {
//       messageBytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
//     }

//     // 5. Convert to Base64
//     let binary = "";
//     messageBytes.forEach((byte) => (binary += String.fromCharCode(byte)));
//     return btoa(binary);
//   } catch (error) {
//     throw new Error(`Decryption failed: ${error.message}`);
//   }
// }

// function generateRandomScalar() {
//   const bytes = new Uint8Array(32);
//   if (typeof window !== "undefined" && window.crypto) {
//     window.crypto.getRandomValues(bytes);
//   } else {
//     for (let i = 0; i < 32; i++) {
//       bytes[i] = Math.floor(Math.random() * 256);
//     }
//   }
//   return new BN(bytes).umod(order.subn(1));
// }

export function asymmetricDecrypt(secKey, cipher) {
  try {
    // Parse inputs
    const secretKey = new BN(secKey, 16);
    const C1 = ec.curve.point(
      new BN(cipher.C1.x, 16),
      new BN(cipher.C1.y, 16)
    );
    const C2 = new BN(cipher.C2, 16);

    // Compute shared secret
    const H = C1.mul(secretKey);
    const messageBN = C2.sub(H.getX()).umod(order);

    // Convert BN back to Base64
    const hexStr = messageBN.toString('hex').padStart(64, '0');
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      bytes[i] = parseInt(hexStr.substr(i*2, 2), 16);
    }
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);

  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}


function generateRandomScalar() {
  const bytes = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(bytes);
  } else if (typeof crypto !== "undefined") {
    crypto.getRandomValues(bytes);
  } else {
    throw new Error(
      "Cryptographically secure random number generator not available"
    );
  }

  // Ensure k is in [1, order-1]
  let k = new BN(bytes).umod(order);
  if (k.isZero()) k = new BN(1); // Should never happen with good RNG
  return k;
}

function pointToString(point) {
  return `x: ${point.getX().toString(16)}, y: ${point.getY().toString(16)}`;
}

function pointToObject(point) {
  return {
    x: point.getX().toString(16),
    y: point.getY().toString(16),
  };
}

// generate a random scalar < order
// const k = new BN(
//   Array.from(crypto.getRandomValues(new Uint8Array(32)))
// ).umod(order);

export function reconstructKey(shareMap, t) {
  console.group("🔑 Threshold Key Reconstruction");
  console.log(`Reconstructing with threshold t=${t}`);

  // Convert share map to array [share1, share2,...]
  const shares = Object.values(shareMap);
  const participantIds = Object.keys(shareMap).map(Number);

  console.assert(
    shares.length >= t,
    `Need at least ${t} shares, got ${shares.length}`
  );

  let reconKey = new BN(0);
  console.log("Initial reconstructed key:", reconKey.toString());

  // Select first t participants for reconstruction
  const selectedParticipants = participantIds.slice(0, t);
  console.log("Using participants:", selectedParticipants);

  for (const j of selectedParticipants) {
    console.group(`Processing Participant ${j}'s share:`);
    console.log("Share value:", shareMap[j].toString());

    // Compute Lagrange coefficient
    let numerator = new BN(1);
    let denominator = new BN(1);

    for (const h of selectedParticipants) {
      if (h !== j) {
        const hBN = new BN(h);
        const jBN = new BN(j);

        numerator = numerator.mul(hBN);
        denominator = denominator.mul(hBN.sub(jBN));

        console.log(`  h=${h}:`);
        console.log(`    numerator = ${numerator.toString()}`);
        console.log(`    denominator = ${denominator.toString()}`);
      }
    }

    // Compute denominator's modular inverse
    const invDenominator = denominator.invm(order);
    console.log("Denominator inverse:", invDenominator.toString());

    // Final Lagrange coefficient
    const lj = numerator.mul(invDenominator).umod(order);
    console.log(`Lagrange coefficient l_${j}:`, lj.toString());

    // Add weighted share
    const weightedShare = shareMap[j].mul(lj).umod(order);
    reconKey = reconKey.add(weightedShare).umod(order);

    console.log(`Current reconstructed key:`, reconKey.toString());
    console.groupEnd();
  }

  console.log("Final reconstructed key:", reconKey.toString());
  console.groupEnd();
  return reconKey;
}

// export const reconstructKey = (subSecretShare, t) => {
//   if (subSecretShare.length < t) {
//     throw new Error("Insufficient shares to reconstruct the key.");
//   }

//   let reconKey = 0;

//   for (let j = 1; j <= t; j++) {
//     let mult = 1;

//     for (let h = 1; h <= t; h++) {
//       if (h !== j) {
//         mult *= h / (h - j);
//       }
//     }

//     reconKey += (subSecretShare[j - 1] * Math.floor(mult)) % order;
//   }

//   return reconKey % order;
// };

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

//============================================================================

export function generatePolynomialAndCommitments(t) {
  const coefficients = [];

  console.log(\n--- Generating Polynomial of degree ${t - 1} ---);
  for (let i = 1; i < t; i++) {
    const coeff = BigInt(Math.floor(Math.random() * Number(order)));
    console.log(Coefficient a_${i} = ${coeff});
    coefficients.push(coeff);
  }

  const commitments = coefficients.map((coeff, index) => {
    const commitment = G.mul(coeff);
    console.log("commitment...", JSON.stringify(commitment));
    console.log(
      `Commitment C_${index + 1} = G * a_${index + 1} = ${commitment}`
    );
    return commitment;
  });

  return { coefficients, commitments };
}

export function evaluatePolynomial(coefficients, x) {
  let result = BigInt(0);
  console.log(`\n--- Evaluating Polynomial at x = ${x} ---`);

  coefficients.forEach((coeff, i) => {
    const term = coeff * BigInt(x) ** BigInt(i);
    console.log(`Term a_${i} * x^${i} = ${coeff} * ${x}^${i} = ${term}`);
    result += term;
  });

  const modResult = result % order;
  console.log(`Polynomial Result mod order = ${modResult}`);

  return modResult;
}

// import { CryptoStorage} from "@webcrypto/storage";

// export async function generateKeyPair() {

//   const { publicKey, privateKey } = await jose.generateKeyPair('ES256', {"extractable": true})

//   const privateJwk = await jose.exportJWK(privateKey)

//   console.log(privateJwk)
//   console.log(privateJwk.d)

//   const ecPrivKey = ec.keyFromPrivate(privateJwk.d, 'hex').getPrivate('hex')

//   console.log(ecPrivKey)

//   //TODO; Add user_id/ password here
//   const cryptoStore = new CryptoStorage('hello');

//   const originalValue = privateKey;
//   await cryptoStore.set('data_key', privateKey);


//   const decryptedValue = await cryptoStore.get('data_key');
//   console.log(typeof(decryptedValue))

//   return privateJwk;

// }

function toBase64Url(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function hexToBase64Url(hex) {
  const bytes = Uint8Array.from(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
  return toBase64Url(bytes);
}

function base64UrlToHex(base64url) {
  const base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(base64url.length + (4 - base64url.length % 4) % 4, '=');
  const binary = atob(base64);
  return Array.from(binary)
    .map(c => ('0' + c.charCodeAt(0).toString(16)).slice(-2))
    .join('');
}

import { storeKey, getKey } from "./indexed_db";

export async function generateKeyPair() {
  const keyPair = ec.genKeyPair();
  const pub = keyPair.getPublic();
  const priv = keyPair.getPrivate('hex');

  const jwk = {
    kty: "EC",
    crv: "P-256",
    x: hexToBase64Url(pub.getX().toString('hex')),
    y: hexToBase64Url(pub.getY().toString('hex')),
    d: hexToBase64Url(priv.toString('hex')),
  };


  await storeKey('my-ec-key', jwk);
  
}

export async function extractECCKeyFromJWK(jwk){
  const privHex = base64UrlToHex(jwk.d);
  const ECprivKey =  ec.keyFromPrivate(privHex, 'hex').getPrivate('hex');
  return ECprivKey;
}

export async function importKey(jwk) {
  
  await storeKey('my-ec-key', jwk);

}


export async function retrieveECCKey(){
  const retrieved = await getKey('my-ec-key');
  return extractECCKeyFromJWK(retrieved); 
}

export async function verify(pubKey, signature, ciphertext) {
    const keyPair = ec.keyFromPublic(pubKey, 'hex');
    const hashedCiphertext = await hashCiphertext(ciphertext);
  
    // 3. Verify Signature
    const isValid = keyPair.verify(hashedCiphertext, signature);
    
    console.log('Verification:');
    console.log(`Signature Valid? ${isValid ? '✅ YES' : '❌ NO'}`);
    console.log('\n=== Process Complete ===');
  
    return {
      privateKey: privKey, // WARNING: For demo only - never expose in production!
      publicKey: pubKey,
      signature: derSignature,
      isValid
    };
  }



export const symmetricDecryption = (ciphertext, sessionKey, ivBase64) => {
  try{
    const decrypted = CryptoJS.AES.decrypt(ciphertext, sessionKey, {
      iv: CryptoJS.enc.Base64.parse(ivBase64),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // 6. Convert to binary and download DECRYPTED file
    const bytes = new Uint8Array(
      decrypted.toString(CryptoJS.enc.Latin1)
        .split('')
        .map(c => c.charCodeAt(0))
    );

    return bytes; 
  }
  catch(err){
    console.log(err)
  }
}


export function generateShares(participantCount, threshold) {
  // Each participant generates their own polynomial
  const coefficients = Array.from({ length: threshold }, () =>
    EC.genKeyPair().getPrivate().toString(16)
  );

  // Generate shares for all participants
  const shares = {};
  for (let i = 1; i <= participantCount; i++) {
    shares[i] = evaluatePolynomial(coefficients, i);
  }

  // Generate verification points (commitments)
  const commitments = coefficients.map(coeff =>
    G.mul(new EC.keyFromPrivate(coeff, 'hex').getPrivate())
  );

  return { shares, commitments };
}

function evaluatePolynomial(coefficients, x) {
  return coefficients.reduce((sum, coeff, idx) => {
    const term = new EC.keyFromPrivate(coeff, 'hex').getPrivate()
      .mul(new BN(x).pow(new BN(idx)));
    return sum.add(term);
  }, new BN(0)).umod(n);
}

// // Combine public keys to get joint public key
export function combinePublicKeys(publicKeys) {
  return publicKeys.reduce((Q, pubKey) =>
    Q.add(EC.keyFromPublic(pubKey, 'hex').getPublic()),
    G.mul(new BN(0)) // Start with infinity point
  );
}

function generateRandomScalar() {
  // Fallback to window.crypto if available, otherwise use Math.random
  const crypto = window.crypto || window.msCrypto;
  let randomBytes;

  if (crypto && crypto.getRandomValues) {
    randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    console.log('Using crypto.getRandomValues');
  } else {
    console.warn('Using Math.random fallback - less secure!');
    randomBytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
  }

  const k = new BN(randomBytes).umod(order.subn(1)); // 0 to p-2
  console.log('Generated k:', k.toString(16));
  return k;
}



export function reconstructKey(shareMap, t) {
  console.group("🔑 Threshold Key Reconstruction");
  console.log(Reconstructing with threshold t=${t});

  // Convert share map to array [share1, share2,...]
  const shares = Object.values(shareMap);
  const participantIds = Object.keys(shareMap).map(Number);

  console.assert(
    shares.length >= t,
    Need at least ${t} shares, got ${shares.length}
  );

  let reconKey = new BN(0);
  console.log("Initial reconstructed key:", reconKey.toString());

  // Select first t participants for reconstruction
  const selectedParticipants = participantIds.slice(0, t);
  console.log("Using participants:", selectedParticipants);

  for (const j of selectedParticipants) {
    console.group(Processing Participant ${j}'s share:);
    console.log("Share value:", shareMap[j].toString());

    // Compute Lagrange coefficient
    let numerator = new BN(1);
    let denominator = new BN(1);

    for (const h of selectedParticipants) {
      if (h !== j) {
        const hBN = new BN(h);
        const jBN = new BN(j);

        numerator = numerator.mul(hBN);
        denominator = denominator.mul(hBN.sub(jBN));

        console.log(`  h=${h}:`);
        console.log(`    numerator = ${numerator.toString()}`);
        console.log(`    denominator = ${denominator.toString()}`);
      }
    }

    // Compute denominator's modular inverse
    const invDenominator = denominator.invm(order);
    console.log("Denominator inverse:", invDenominator.toString());

    // Final Lagrange coefficient
    const lj = numerator.mul(invDenominator).umod(order);
    console.log(Lagrange coefficient l_${j}:, lj.toString());

    // Add weighted share
    const weightedShare = shareMap[j].mul(lj).umod(order);
    reconKey = reconKey.add(weightedShare).umod(order);

    console.log(Current reconstructed key:, reconKey.toString());
    console.groupEnd();
  }

  console.log("Final reconstructed key:", reconKey.toString());
  console.groupEnd();
  return reconKey;
}


// export function asymmetricDecrypt(secKey, cipher) {
//   try {
//     // 1. Parse inputs
//     const secretKey = typeof secKey === "string" ? new BN(secKey, 16) : secKey;
//     const C1 = EC.curve.point(new BN(cipher.C1.x, 16), new BN(cipher.C1.y, 16));
//     const C2 = new BN(cipher.C2, 16);

//     // 2. Compute shared secret H = secretKey * C1
//     const H = C1.mul(secretKey);

//     // 3. Recover message BN = (C2 - H.x) mod order
//     const messageBN = C2.sub(H.getX()).umod(order);

//     // 4. Convert BN to Uint8Array (32 bytes, big-endian)
//     const messageBytes = new Uint8Array(32);
//     const hexStr = messageBN.toString(16).padStart(64, "0");

//     for (let i = 0; i < 32; i++) {
//       messageBytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
//     }

//     // 5. Convert to Base64
//     let binary = "";
//     messageBytes.forEach((byte) => (binary += String.fromCharCode(byte)));
//     return btoa(binary);
//   } catch (error) {
//     throw new Error(Decryption failed: ${error.message});
//   }
// }

// function generateRandomScalar() {
//   const bytes = new Uint8Array(32);
//   if (typeof window !== "undefined" && window.crypto) {
//     window.crypto.getRandomValues(bytes);
//   } else {
//     for (let i = 0; i < 32; i++) {
//       bytes[i] = Math.floor(Math.random() * 256);
//     }
//   }
//   return new BN(bytes).umod(order.subn(1));
// }