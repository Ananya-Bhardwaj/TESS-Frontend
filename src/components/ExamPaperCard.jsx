import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CryptoJS from "crypto-js";
import { verify } from "../utils";

const ExamPaperCard = ({ subjectCode, year, session, paperId, name}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState(""); 

  const [data, setData] = useState('Initializing...')

  const [dataArray, setDataArray] = useState(() => {
    // Load initial data from local storage
    const savedData = localStorage.getItem('streamedData');
    return savedData ? JSON.parse(savedData) : [];
  });


    useEffect(() => {
      const sse = new EventSource('http://localhost:5000/stream')
  
      function handleStream(e){
        console.log(e)
        setData(e.data) //the data server are sedning 
  
        setDataArray((prevArray) => {
          const updatedArray = [...prevArray, e.data];
          localStorage.setItem('streamedData', JSON.stringify(updatedArray));
          return updatedArray;
        });
      }
  
      sse.onmessage = e =>{handleStream(e)}
  
      sse.onerror = e => {
        //GOTCHA - can close stream and 'stall'
        sse.close()
      }
  
      return () => {
        sse.close()
        
      }
    },)  
  
  // const [decryptedData, setDecryptedData] = useState("");
  // const [isDecrypting, setIsDecrypting] = useState(false);

  const handleVerification = () => {
    //for verification, user's public key is used
    //fetch signature and ciphertext
    // setIsLoading(true);
    // setTimeout(() => {
    //   const verificationPassed = Math.random() > 0.2; // 80% pass
    //   if (verificationPassed) {
    //     setIsVerified(true);
    //     toast.success("Verification successful!");
    //   } else {
    //     toast.error("Verification failed. Please try again.");
    //   }
    //   setIsLoading(false);
    // }, 900);
    // const verificationResult = verify(pubKey, signature, ciphertext);

    // let res = axios.get("http:localhost:5000/api/papers/" + paperId);
    // if (res.status === 200){
    //   let pubKey = res.data["public_key"];
    //   let signature = res.data["sign"];
    //   let ciphertext = res.data["ciphertext"];
    //   let sessionKey = res.data["session_key"]; 
    // }
    
    const verificationResult = true; // Replace with actual verification logic
    if (verificationResult) {
      setIsVerified(true);
      toast.success("Verification successful!");
    } else {
      toast.error("Verification failed. Please try again.");
    }
  };

  // Decrypt the file

  // Test with your exact values
  const testDecryption = () => {
    let ciphertext = "U2FsdGVkX19IF9lygkrjYDL/Lri9AQh3x4L4s/FQdzs=";
    var bytes = CryptoJS.AES.decrypt(ciphertext, );
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    console.log(originalText); // 'my message'

    // try {
    //   const ciphertext = "Esl4r1tlJucaGKZWJWqXGA==";
    //   const iv = "LzTgE4RTNZWNDyPSudwXcg==";
    //   const key = "FQenezA5hnepCyvAmHG7kHy9moO3aaKMM50gMaX7aos=";

    //   // 1. Parse inputs
    //   const parsedKey = CryptoJS.enc.Base64.parse(key);
    //   const parsedIV = CryptoJS.enc.Base64.parse(iv);

    //   // 2. Decrypt directly (alternative method)
    //   const decrypted = CryptoJS.AES.decrypt(
    //     {
    //       ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
    //     },
    //     parsedKey,
    //     {
    //       iv: parsedIV,
    //       mode: CryptoJS.mode.CBC,
    //       padding: CryptoJS.pad.Pkcs7,
    //     }
    //   );

    //   // 3. Output verification
    //   console.log("Decrypted hex:", decrypted.toString(CryptoJS.enc.Hex));
    //   console.log("As UTF-8:", decrypted.toString(CryptoJS.enc.Utf8));
    //   console.log("As Latin1:", decrypted.toString(CryptoJS.enc.Latin1));

    //   console.log("Key length:", CryptoJS.enc.Base64.parse(key).words.length); // Should be 8 (256-bit)
    //   console.log("IV length:", CryptoJS.enc.Base64.parse(iv).words.length); // Should be 4 (128-bit)

    //   console.log(
    //     "Ciphertext words:",
    //     CryptoJS.enc.Base64.parse(ciphertext).words
    //   );

    //   console.log("CryptoJS version:", CryptoJS.version);
    //   // Should be "3.1.2" or higher

    //   return decrypted.toString(CryptoJS.enc.Utf8);
    // } catch (e) {
    //   console.error("Critical error:", e);
    //   return null;
    // }
  };

  // Run immediately to verify
  // const result = testDecryption();
  // console.log("Final output:", result);
  // const handleDecryptPaper = async () => {
  //   setIsDecrypting(true);

  //   try {
  //     // 1. Decrypt the file
  //     const decryptedBuffer = decryptFile(
  //       "7CiS7uNXPXWzH3KgNfdHBQ==", // ciphertext
  //       "kBMpAmnpcXTBeldQZHcr8g==", // iv
  //       "AeYebecco8ai45Uqkm7KjFD/YzlVnhRTGa/x/oUv+6k=" // key
  //     );

  //     // 2. Create and trigger download
  //     const blob = new Blob([decryptedBuffer], { type: 'application/pdf' });
  //     const url = URL.createObjectURL(blob);

  //     const a = document.createElement('a');
  //     a.href = url;
  //     //a.download = 'decrypted_document.pdf'; // Customize filename if needed
  //     document.body.appendChild(a);
  //     a.click();

  //     // Cleanup
  //     setTimeout(() => {
  //       document.body.removeChild(a);
  //       URL.revokeObjectURL(url);
  //     }, 100);

  //   } catch (error) {
  //     console.error('Decryption failed:', error);
  //     alert('Decryption failed. Please check the key and try again.');
  //   } finally {
  //     setIsDecrypting(false);
  //   }
  // }

  const decryptPaper = async () => {
    setIsVerified(false); 
    toast.success("Decryption successful!");

    const blob = new Blob([JSON.stringify({"message": "Decrypted"})], { type: "application/json" });

    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = "END SEM(II PART).docx.pdf"; // Set the file name
    document.body.appendChild(a); // Append the anchor to the document
    a.click(); // Trigger the download
    document.body.removeChild(a); // Remove the anchor from the document

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(objectUrl);

  }

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6 m-4 w-60">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{subjectCode}</h2>
        <p className="text-lg text-gray-600 mb-1">{year}</p>
        <p className="text-md text-gray-500 mb-6">{session} Exam</p>

        <div className="h-8" />

        {!isVerified ? (
          <button
            onClick={handleVerification}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        ) : (
          <div className="flex flex-col space-y-2">
            <button
              onClick={decryptPaper}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
            >
              Decrypt Paper
            </button>
            <button
              onClick={() => {handleVerification()}}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Verify again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPaperCard;
