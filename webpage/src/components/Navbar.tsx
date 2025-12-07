import { useState } from 'react';

interface NavbarProps {
  onUploadClick: () => void;
}

export default function Navbar({
  onUploadClick,
}: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800">Memebot</h1>
      </div>
      <div className="flex items-center gap-3">
        {(
          <button
            onClick={onUploadClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Upload Image
          </button>
        )}
      </div>
    </nav>
  );
}