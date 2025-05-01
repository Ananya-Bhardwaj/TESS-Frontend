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


const G = ec.g; // base point
const order = ec.n; // order of the curve

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

export async function verify(hash) {
  
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