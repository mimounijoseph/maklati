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
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-5 py-2.5"
      >
        Choose an image for Plat
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-xl relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search Photos
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close modal"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="flex mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for photos..."
                className="flex-1 p-2.5 border border-gray-300 rounded-l-lg"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 rounded-r-lg"
              >
                Search
              </button>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.src.medium}
                  alt={`Pexels result ${index + 1}`}
                  className="h-auto max-w-full rounded-lg cursor-pointer hover:opacity-80"
                  onClick={() => handleSelect(photo.src.original)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PexelsSearchModal;
