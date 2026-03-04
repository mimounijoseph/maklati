import React, { FC, useEffect, useRef, useState } from "react";

interface PexelsSearchModalProps {
  onSelect: (photoUrl: string) => void;
}

interface PexelsPhoto {
  src: {
    medium: string;
    original: string;
    [key: string]: string;
  };
}

const PexelsSearchModal: FC<PexelsSearchModalProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`,
        {
          signal: controllerRef.current.signal,
          headers: {
            Authorization:
              "TQfzpkVswmtfjTOVMMPS6lRWsZpVgIh4fXJvZgjc94JhHX0HE1dovHiY",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch from Pexels API");
      }

      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (error: any) {
      if (error?.name === "AbortError") return;
      console.error("Error fetching Pexels API:", error);
    }
  };

  const handleSelect = (url: string) => {
    onSelect(url);
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="block w-full rounded-2xl bg-orange-500 px-5 py-3 text-center text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          <div className="flex justify-center gap-2">
            <div>Choose an image for Plat</div>
            <div>
              <svg
                className="h-6 w-6 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-xl p-4">
            <div className="relative rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Search Photos
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4 flex text-gray-900">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for photos..."
                  className="flex-1 rounded-l-lg border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="rounded-r-lg bg-orange-500 px-4 text-white hover:bg-orange-600"
                >
                  Search
                </button>
              </div>

              <div className="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.src.medium}
                    alt={`Pexels result ${index + 1}`}
                    className="h-auto w-full cursor-pointer rounded-lg transition hover:opacity-80"
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
