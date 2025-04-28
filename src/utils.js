//symmetric encryption
import fs from 'fs'; 
import crypto from 'crypto'; 
import { ec as EC } from "elliptic";
import { BN } from 'bn.js';


// Initialize curve (e.g., 'secp256k1', 'p256', etc.)
const ec = new EC('secp256k1');
const G = ec.g; // base point
const order = ec.n; // order of the curve

export function encryptFile(key, filename) {
  // Convert the key (a string or Buffer) to a usable encryption key and IV
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16); // Initialization vector

  // Ensure the key is a 32-byte Buffer
  const encryptionKey = crypto.createHash('sha256').update(String(key)).digest();

  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

  // Read the original file
  const originalData = fs.readFileSync(filename);

  // Encrypt the data
  let encrypted = cipher.update(originalData);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Save the IV with the encrypted data (prepend IV to encrypted data)
  const encryptedWithIv = Buffer.concat([iv, encrypted]);

  // Write the encrypted file
  fs.writeFileSync(filename, encryptedWithIv);

  console.log('File encrypted successfully.');
}

//symmetric decryption

export function decryptFile(filename, key) {
  const algorithm = 'aes-256-cbc';

  // Ensure the key is a 32-byte Buffer
  const encryptionKey = crypto.createHash('sha256').update(String(key)).digest();

  // Read the encrypted file
  const encryptedData = fs.readFileSync(filename);

  // Extract the IV from the beginning of the file (first 16 bytes)
  const iv = encryptedData.slice(0, 16);
  const encryptedContent = encryptedData.slice(16);

  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);

  // Decrypt the data
  let decrypted = decipher.update(encryptedContent);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // Write the decrypted data back to the file
  fs.writeFileSync(filename, decrypted);

  console.log('File decrypted successfully.');
}


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
  const h = BigInt('0x' + crypto.createHash('sha256').update(message).digest('hex'));

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
  const h = BigInt('0x' + crypto.createHash('sha256').update(message).digest('hex'));

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

export function generateSessionKey(){
  console.log("session key generated");
}
export function encryptPaper(){
  console.log("paper encrypted");
}
export function encryptSessionKey(sessionKey){
  //fetch public key from backend
  let C1, C2 = asymmetricEncryption(pubKey, sessionKey)
}
export function decryptPaper(){
  console.log("paper decrypted");
}
export function decryptSessionKey(){
  console.log("session key encrypted");
}
export function signPaper(){
  console.log("paper signed");
}
export function verifyPaper(){
  console.log("paper verified");
}