import React, { FC, useEffect, useState } from "react";
import { auth } from "@/config/firebase"; // adjust path
import { onAuthStateChanged, User } from "firebase/auth";

const UrlInput: FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const url = userId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/menu/${userId}`
    : "";

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 flex justify-between items-center">
        <label
          htmlFor="website-url"
          className="text-sm font-medium text-gray-900"
        >
          Your menu URL:
        </label>
      </div>
      <div className="flex items-center relative">
        <span className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg">
          URL
        </span>
        <div className="relative w-full">
          <input
            id="website-url"
            type="text"
            className="bg-gray-50 border border-e-0 border-gray-300 text-gray-500 text-sm border-s-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={url || "Loading..."}
            disabled
          />
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-e-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 border border-blue-700"
          type="button"
        >
          {copied ? (
            // ✅ Success icon
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
          ) : (
            // 📋 Copy icon
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
            </svg>
          )}
        </button>

        {/* Tooltip / small popup */}
        {copied && (
          <div className="absolute right-0 -bottom-8 px-2 py-1 text-xs text-white bg-gray-700 rounded">
            Copied!
          </div>
        )}
      </div>
      {/* <p
        id="helper-text-explanation"
        className="mt-2 text-sm text-gray-500"
      >
        Security certificate is required for approval
      </p> */}
    </div>
  );
};

export default UrlInput;
