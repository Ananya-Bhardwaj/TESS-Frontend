import React, { useState } from "react";
import { filterOptions } from "../assets/assets";
import { toast } from "react-toastify";
import { encryptFile, generateSessionKey, signatureGeneration } from "../utils";
import CryptoJS from "crypto-js";
import { ec, ec as EC } from 'elliptic';

const UploadPaper = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptedData, setEncryptedData] = useState(null);

  const [formData, setFormData] = useState({
    subjectCode: "",
    year: "",
    session: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFormData((prev) => ({ ...prev, file }));
    setIsEncrypted(false);
  };

  const handleCancel = () => {
    setFormData({
      subjectCode: "",
      year: "",
      session: "",
      file: null,
    });
  };


const ec = new EC('secp256k1'); // Initialize elliptic curve

// async function encryptSignAndDownload(selectedFile) {
//   try {
//     // 1. Generate ECDSA key pair
//     const keyPair = ec.genKeyPair();
//     const pubKey = keyPair.getPublic('hex');
//     const privKey = keyPair.getPrivate('hex');

//     // 2. Generate session key and read file
//     const sessionKey = generateSessionKey();
//     const fileData = await selectedFile.arrayBuffer();

//     // 3. Encrypt the file
//     const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(fileData));
//     const encrypted = CryptoJS.AES.encrypt(wordArray, sessionKey, {
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });
    
//     const ciphertext = encrypted.toString();
//     const ivBase64 = encrypted.iv.toString(CryptoJS.enc.Base64);

//     // 4. Create SHA-256 hash of ciphertext
//     const msgHash = CryptoJS.SHA256(ciphertext).toString();

//     // 5. Sign the hash with private key (ECDSA)
//     const signature = keyPair.sign(msgHash, 'hex', { canonical: true });
//     const signatureDer = signature.toDER('hex');

//     // 6. Prepare encrypted package
//     const encryptedPackage = {
//       ciphertext,
//       iv: ivBase64,
//       signature: signatureDer,
//       publicKey: pubKey,
//       filename: selectedFile.name,
//       algorithm: "AES-256-CBC+ECDSA-secp256k1",
//       timestamp: new Date().toISOString()
//     };

//     // 7. Download encrypted package
//     downloadFile(
//       JSON.stringify(encryptedPackage, null, 2),
//       `encrypted_${selectedFile.name}.json`,
//       'application/json'
//     );

//     // 8. Verify and download decrypted file (optional)
//     const decrypted = CryptoJS.AES.decrypt(ciphertext, sessionKey, {
//       iv: CryptoJS.enc.Base64.parse(ivBase64),
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7
//     });
    
//     downloadFile(
//       wordArrayToArrayBuffer(decrypted),
//       `decrypted_${selectedFile.name}`,
//       selectedFile.type
//     );

//     return {
//       sessionKey: sessionKey.toString(),
//       iv: ivBase64,
//       signature: signatureDer,
//       publicKey: pubKey,
//       privateKey: privKey, // WARNING: Only for demo, never expose in production!
//       originalFilename: selectedFile.name
//     };

//   } catch (error) {
//     console.error("File processing failed:", error);
//     throw error;
//   }
// }

// Helper functions
// // function generateSessionKey() {
//   return CryptoJS.lib.WordArray.random(32);
// }

// function wordArrayToArrayBuffer(wordArray) {
//   const latin1 = wordArray.toString(CryptoJS.enc.Latin1);
//   const bytes = new Uint8Array(latin1.length);
//   for (let i = 0; i < latin1.length; i++) {
//     bytes[i] = latin1.charCodeAt(i);
//   }
//   return bytes.buffer;
// }

// function downloadFile(data, filename, type = 'application/octet-stream') {
//   const blob = new Blob([data], { type });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   setTimeout(() => {
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   }, 200);
// }

// Verification function (for recipient)
// function verifyPackage(encryptedPackage) {
//   const keyPair = ec.keyFromPublic(encryptedPackage.publicKey, 'hex');
//   const msgHash = CryptoJS.SHA256(encryptedPackage.ciphertext).toString();
  
//   try {
//     const signature = keyPair.verify(
//       msgHash,
//       encryptedPackage.signature
//     );
//     return {
//       isValid: signature,
//       isRecent: (Date.now() - new Date(encryptedPackage.timestamp)) < 300000 // 5 min
//     };
//   } catch (e) {
//     return { isValid: false, error: e.message };
//   }
// }

//ye upar vale idr chalr rhe ya nhi but not needed coz neeche vala encrypt decrpt chal rha signature kar rhi abhi

async function encryptDecryptAndDownload() {
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
      
      console.log("Encryption details:", {
        ciphertext,
        iv: ivBase64,
        sessionKey: sessionKey.toString()
      });
  
      // 4. Download ENCRYPTED file (as JSON containing ciphertext + IV)
      const encryptedData = {
        ciphertext,
        iv: ivBase64,
        filename: selectedFile.name
      };
      
      const encryptedBlob = new Blob(
        [JSON.stringify(encryptedData, null, 2)], 
        { type: 'application/json' }
      );
      
      const encryptedUrl = URL.createObjectURL(encryptedBlob);
      const encryptedLink = document.createElement('a');
      encryptedLink.href = encryptedUrl;
      encryptedLink.download = `encrypted_${selectedFile.name}.json`;
      document.body.appendChild(encryptedLink);
      encryptedLink.click();

      const hashPaper = hashCiphertext(ciphertext);
      console.log(hashPaper);

      //4.5 signature ka func called here neeche defined hai
      signAndVerify(hashPaper);


      // 5. Decrypt (for verification)
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
      
      const decryptedBlob = new Blob([bytes.buffer], { type: selectedFile.type });
      const decryptedUrl = URL.createObjectURL(decryptedBlob);
      const decryptedLink = document.createElement('a');
      decryptedLink.href = decryptedUrl;
      decryptedLink.download = `decrypted_${selectedFile.name}`;
      document.body.appendChild(decryptedLink);
      decryptedLink.click();
  
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(encryptedLink);
        document.body.removeChild(decryptedLink);
        URL.revokeObjectURL(encryptedUrl);
        URL.revokeObjectURL(decryptedUrl);
      }, 200);
  
      return {
        sessionKey: sessionKey.toString(),
        iv: ivBase64,
        originalFilename: selectedFile.name
      };
  
    } catch (error) {
      console.error("File processing failed:", error);
      throw error;
    }
  }

  async function hashCiphertext(ciphertext) {
    // Convert Base64 ciphertext to ArrayBuffer
    const binaryString = atob(ciphertext);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);

    // Convert to Hex for readable output not actually needed just for checking
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log('SHA-256 Hash (Hex):', hashHex);
    
    // Also show Base64 version
    const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
    console.log('SHA-256 Hash (Base64):', hashBase64);
    return hashHex;
  }

  // ye abhi work kar rhi ispe not working filhaal
  async function signAndVerify(hash) {
    console.log('=== Starting ECDSA Process ===');
    const hashedCiphertext = await Promise.resolve(hash);
    console.log(`Input hash: ${hashedCiphertext}\n`);
  
    // 1. Generate Key Pair
    const keyPair = ec.genKeyPair();
    const privKey = keyPair.getPrivate('hex');
    const pubKey = keyPair.getPublic('hex');
    
    console.log('Generated Key Pair:');
    console.log(`Private Key: ${privKey}`);
    console.log(`Public Key: ${pubKey}\n`);
  
    // 2. Sign the Hash
    const signature = keyPair.sign(hashedCiphertext, 'hex', {
      canonical: true,
    });
    const derSignature = signature.toDER('hex');
    
    console.log('Created Signature:');
    console.log(`R: ${signature.r.toString(16)}`);
    console.log(`S: ${signature.s.toString(16)}`);
    console.log(`DER Format: ${derSignature}\n`);
  
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

  // const encryptHandler = async () => {
  //   // Your encryption logic here
  //   if (!validateForm()) return;
  //   // Proceed with encryption
  //   else {
  //     const sessionKey = generateSessionKey();
  //     // var ciphertext = CryptoJS.AES.encrypt(selectedFile, sessionKey).toString();
  //     // console.log("cipher text:", ciphertext);

  //     // var bytes = CryptoJS.AES.decrypt(ciphertext, sessionKey);
  //     // var originalText = bytes.toString(CryptoJS.enc.Utf8);

  //     // console.log(originalText); // 'my message'
  //     // Read file as ArrayBuffer
  //     const fileData = await selectedFile.arrayBuffer();

  //     // Convert to CryptoJS WordArray
  //     const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(fileData));

  //     // Encrypt
  //     const encrypted = CryptoJS.AES.encrypt(wordArray, sessionKey, {
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7,
  //     });
  //     const ciphertext = encrypted.toString();
  //     const ivBase64 = encrypted.iv.toString(CryptoJS.enc.Base64);
  //     console.log("encrypted data:", {
  //       ciphertext: encrypted.toString(),
  //       iv: encrypted.iv.toString(CryptoJS.enc.Base64)
  //     });

  //     const decrypted = CryptoJS.AES.decrypt(ciphertext, sessionKey, {
  //       iv: CryptoJS.enc.Base64.parse(ivBase64),
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     });
  //     const bytes = new Uint8Array(
  //       decrypted.toString(CryptoJS.enc.Latin1)
  //         .split('')
  //         .map(c => c.charCodeAt(0))
  //     );
  //     return bytes.buffer;
  //     // const message = "abcdefg";
  //     // console.log('unencrypted:', message);
  //     // const result = await encryptFile(message, sessionKey);
  //     // setEncryptedData({
  //     //   sessionKey,
  //     //   iv: result.iv,
  //     //   ciphertext: result.ciphertext
  //     // });

  //     // console.log('encrypted paper', message);

  //     // console.log('Encrypted:', {
  //     //   key: sessionKey,  // Securely store this!
  //     //   iv: result.iv,
  //     //   ciphertext: result.ciphertext
  //     // });
  //   }
  //   // try {

  //   //   encryptFile();
  //   //   console.log("Encrypting paper...");
  //   //   // Simulate upload
  //   //   toast.success("File encrypted successfully!");
  //   //   setIsEncrypted(true); // toggle to show next button
  //   // } catch (error) {
  //   //   console.error("Encryption failed", error);
  //   //   toast.error("Encryption failed. Please try again.");
  //   // }
  // };

  const submitHandler = () => {
    if (!validateForm()) return;
    // Proceed with signing and uploading
    try {
      signatureGeneration();
      console.log("Uploading paper...");
      // Simulate upload
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("File upload failed. Please try again.");
    }
  };

  const validateForm = () => {
    if (
      !formData.subjectCode ||
      !formData.year ||
      !formData.session ||
      !formData.file
    ) {
      alert("Please fill out all fields and upload a paper before proceeding.");
      return false;
    }

    return true;
  };

  return (
    <div className="w-full py-16 flex justify-center">
      <div className="max-w-2xl p-10 w-full min-h-4 justify-center items-center bg-white rounded-lg border border-gray-500/30 shadow-[0px_1px_15px_0px] shadow-black/10 text-sm space-y-4">
        {/* Subject Dropdown */}
        <div>
          <label
            htmlFor="subjectCode"
            className="block text-gray-800 text-[19px] font-medium mb-1"
          >
            Subject Code
          </label>
          <select
            id="subjectCode"
            name="subjectCode"
            value={formData.subjectCode}
            onChange={handleChange}
            className="w-full border border-gray-300 cursor-pointer rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Subject</option>
            {filterOptions.subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div>
          <label
            htmlFor="year"
            className="block text-gray-800 text-[19px] font-medium mb-1"
          >
            Year
          </label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full border border-gray-300 cursor-pointer rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Year</option>
            {filterOptions.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Session Dropdown */}
        <div>
          <label
            htmlFor="session"
            className="block text-gray-800 text-[19px] font-medium mb-1"
          >
            Session
          </label>
          <select
            id="session"
            name="session"
            value={formData.session}
            onChange={handleChange}
            className="w-full border border-gray-300 cursor-pointer rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Session</option>
            {filterOptions.sessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <label
          htmlFor="fileInput"
          className="border-2 border-dotted border-gray-400 p-8 mt-2 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-500 transition rounded"
        >
          <span className="text-3xl">📄</span>
          <p className="text-gray-500">Drag files here to upload</p>
          <p className="text-gray-400">
            Or <span className="text-blue-500 underline">click here</span> to
            select a file
          </p>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          {selectedFile && (
            <p className="text-sm text-green-600 mt-2">{selectedFile.name}</p>
          )}
        </label>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-9 py-2 border border-gray-500/50 bg-white hover:bg-blue-100/30 active:scale-95 transition-all text-gray-500 rounded"
          >
            Cancel
          </button>
          {selectedFile && !isEncrypted && (
            <button
              type="button"
              onClick={encryptDecryptAndDownload}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all text-white rounded"
            >
              Encrypt Paper
            </button>
          )}

          {isEncrypted && (
            <button
              type="button"
              onClick={submitHandler}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white rounded"
            >
              Sign and Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPaper;
