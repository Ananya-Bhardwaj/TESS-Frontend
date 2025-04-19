import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExamPaperCard = ({ subjectCode, year, session }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = () => {
    setIsLoading(true);
    setTimeout(() => {
      const verificationPassed = Math.random() > 0.2; // 80% pass
      if (verificationPassed) {
        setIsVerified(true);
        toast.success('Verification successful!');
      } else {
        toast.error('Verification failed. Please try again.');
      }
      setIsLoading(false);
    }, 900);
  };

  const handleDecryptPaper = () => {
    toast.info('Decrypting paper...');
    // Decryption logic here
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6 m-4">
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
              isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        ) : (
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleDecryptPaper}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
            >
              Decrypt Paper
            </button>
            <button
              onClick={() => setIsVerified(false)}
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
