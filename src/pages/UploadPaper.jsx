import React, { useState } from "react";
import { filterOptions } from "../assets/assets";
import { toast } from "react-toastify";

const UploadPaper = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEncrypted, setIsEncrypted] = useState(false);

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

  const encryptPaper = () =>{
    console.log("paper encryption logic here");
  }

  const encryptHandler = () => {
    // Your encryption logic here
    if (!validateForm()) return;
    // Proceed with encryption
    try {
      encryptPaper();
      console.log("encrypting paper...");
      // Simulate upload
      toast.success("File encrypted successfully!");
      setIsEncrypted(true); // toggle to show next button
    } catch (error) {
      console.error("Encryption failed", error);
      toast.error("Encryption failed. Please try again.");
    }
  };

  const signPaper = () => {
    // Your signing logic here
    console.log("Signing paper...");
  };

  const submitHandler = () => {
    if (!validateForm()) return;
    // Proceed with signing and uploading
    try {
      signPaper();
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
              onClick={encryptHandler}
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
