import React, { FC, useState } from "react";

interface PexelsSearchModalProps {
  onSelect: (photoUrl: string) => void;
}

interface PexelsPhoto {
  src: {
    medium: string;
    original: string;
    [key: string]: string; // fallback for other sizes
  };
}

const PexelsSearchModal: FC<PexelsSearchModalProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          query
        )}&per_page=12`,
        {
          headers: {
            Authorization:
              "TQfzpkVswmtfjTOVMMPS6lRWsZpVgIh4fXJvZgjc94JhHX0HE1dovHiY", // ⚠️ replace with ENV variable
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch from Pexels API");
      }

      const data = await res.json();
      if (data.photos) {
        setPhotos(data.photos);
      }
    } catch (err) {
      console.error("Error fetching Pexels API:", err);
    }
  };

  const handleSelect = (url: string) => {
    onSelect(url);
    setIsOpen(false);
  };

  return (
    <>
      {/* Button to open modal */}
      <div className="flex  m-5">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="block text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <div className="flex justify-center gap-2">
              <div>
                  Choose an image for Plat
              </div>
              <div>
                <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z"/>
                </svg>
              </div>
          </div>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/50">
          <div className="relative p-4 w-full max-w-xl">
            {/* Modal content */}
            <div className="relative p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
              {/* Modal header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Search Photos
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 
                      1 0 111.414 1.414L11.414 10l4.293 
                      4.293a1 1 0 01-1.414 
                      1.414L10 11.414l-4.293 
                      4.293a1 1 0 
                      01-1.414-1.414L8.586 
                      10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Search input */}
              <div className="flex mb-4 text-gray-900">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for photos..."
                  className="flex-1 p-2.5 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-orange-500 text-white px-4 rounded-r-lg hover:bg-orange-600"
                >
                  Search
                </button>
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.src.medium}
                    alt={`Pexels result ${index + 1}`}
                    className="h-auto w-full rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={() => handleSelect(photo.src.original)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PexelsSearchModal;
