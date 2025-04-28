// //symmetric encryption
// const fs = require('fs');
// const crypto = require('crypto');

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

// //symmetric decryption

// function decryptFile(filename, key) {
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

// //asymmetric encryption
// const EC = require('elliptic').ec;
// const BN = require('bn.js');

// // Initialize curve (e.g., 'secp256k1', 'p256', etc.)
// const ec = new EC('secp256k1');
// const G = ec.g; // base point
// const order = ec.n; // order of the curve

// function asymmetricEncryption(pubKey, message) {
//   // pubKey is an EC point
//   // message is an integer (Number or BN)

//   const k = new BN(ec.rand().toArrayLike(Buffer)).umod(order); // random scalar < order

//   const C1 = G.mul(k); // k * G
//   const H = pubKey.mul(k); // k * pub_key
//   const Hy = H.getY(); // y-coordinate of H

//   const msgBN = new BN(message);
//   const C2 = msgBN.add(Hy).umod(order); // C2 = (message + H.y) % order

//   return { C1, C2 };
// }
// //asymmetric decryption

export function generateSessionKey(){
  console.log("session key generated");
}
export function encryptPaper(){
  console.log("paper encrypted");
}
export function encryptSessionKey(){
  console.log("session key encrypted");
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