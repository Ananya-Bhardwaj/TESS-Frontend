import React, { useEffect, useState } from "react";
import { filterOptions } from "../assets/assets";
import { toast } from "react-toastify";
import { generateSessionKey, symmetricDecryption} from "../utils";
import CryptoJS, { enc } from "crypto-js";
import { ec, ec as EC } from 'elliptic';
import { sign, verify, symmtericEncryption, hashCiphertext, asymmetricEncryption } from "../utils"; 
import axios from "axios";
import { fetchSubjects } from "../data";
import { useAuth } from "../providers/AuthProvider";

const UploadPaper = () => {
  const [subjects, setSubjects] = useState([]); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptedData, setEncryptedData] = useState(null);

  const { user } = useAuth(); 

  const [formData, setFormData] = useState({
    subject: "",
    // year: "",
    exam_type: "",
    file: null,
  });

  useEffect(() => {
    //set subjects and get the data from fetchSubjects function
    const fetchData = async () => {
      try {
        const data = await fetchSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchData();

  }, [])

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
      subject: "",
      // year: "",
      exam_type: "",
      file: null,
    });
  };

  const fetchPublicKey = async () => {
    try {
      //TODO: fetch using institution id
      const response = await axios.get(`http://localhost:5000/api/public-key/`);
      if (response.status === 200){
        setPubKey(response.data.publicKey); // Adjust based on your API response structure
      }
    } catch (error) { 
      console.error("Error fetching public key:", error);
      throw error;
    }
  };

  const encryptPaper = async() => {
    try{
      const data = await symmtericEncryption(selectedFile); 
      setEncryptedData(data); 
      setIsEncrypted(true); 
      //implement this function 
      // fetchPublicKey();
      // asymmetricEncryption(data.sessionKey, pubKey); 
      // encryptSessionKey(data.sessionKey);
    }catch(err){
      console.error("File processing failed:", err);
      throw err;
    }
  }

  const signPaper = async () => {
    try {
      const signature = await sign(encryptedData.ciphertext); 
      
      setFormData((prev) => ({ ...prev, sign: signature["derSignature"], ciphertext: encryptedData.ciphertext, sessionKey: encryptedData.sessionKey, iv: encryptedData.iv, publicKey: signature["pubKey"] }));
     
      const token = localStorage.getItem("token");

      //upload to db 
      const response = await axios.post('http://localhost:5000/api/papers', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }); 

      console.log("File signed and uploaded successfully:", response.data);
      toast.success("File signed and uploaded successfully!");

    }catch(err){
      console.error("Error signing file", err); 
      toast.error("Error signing file. Please try again.");
      throw err; 
    }
  }


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
      !formData.subject ||
      // !formData.year ||
      !formData.exam_type ||
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
            htmlFor="subject"
            className="block text-gray-800 text-[19px] font-medium mb-1"
          >
            Subject Code
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 cursor-pointer rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Subject</option>
            {subjects.map((curr_subject) => (
              <option key={curr_subject.name} value={curr_subject.subject_id}>
                {curr_subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        {/* <div>
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
        </div> */}

        {/* Session Dropdown */}
        <div>
          <label
            htmlFor="exam_type"
            className="block text-gray-800 text-[19px] font-medium mb-1"
          >
            Session
          </label>
          <select
            id="exam_type"
            name="exam_type"
            value={formData.exam_type}
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
              onClick={encryptPaper}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all text-white rounded"
            >
              Encrypt Paper
            </button>
          )}

          {isEncrypted && (
            <button
              type="button"
              onClick={signPaper}
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