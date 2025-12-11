import { useState, useEffect } from 'react';
import type { Image } from '../types';
import { api } from '../api';

interface ImageModalProps {
  image: Image;
  onClose: () => void;
  onSave: (imageId: number, aliases: string[]) => Promise<void>;
  onDelete: (imageId: number) => Promise<void>;
}

export default function ImageModal({
  image,
  onClose,
  onSave,
  onDelete,
}: ImageModalProps) {
  const [aliases, setAliases] = useState<string[]>([]);
  const [newAlias, setNewAlias] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [allAliases, setAllAliases] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    // Load all aliases and map image's aliasesIds to names
    api.getAllAliases().then(allAliasesData => {
      setAllAliases(allAliasesData);
      const aliasNames = image.aliasesIds
        .map(id => allAliasesData.find(a => a.id === id)?.name)
        .filter((name): name is string => name !== undefined);
      setAliases(aliasNames);
    });
  }, [image]);

  const handleAddAlias = () => {
    if (newAlias.trim() && !aliases.includes(newAlias.trim())) {
      setAliases([...aliases, newAlias.trim()]);
      setNewAlias('');
    }
  };

  const handleRemoveAlias = (alias: string) => {
    setAliases(aliases.filter((a) => a !== alias));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(image.id, aliases);
      onClose();
    } catch (error) {
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await onDelete(image.id);
        onClose();
      } catch (error) {
        alert('Failed to delete image');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-6 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={api.getImageUrl(image.id, image.extension)}
              alt={`Image ${image.id}`}
              className="w-full h-auto"
            />
          </div>

          <div className="space-y-4 mb-6">
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Image ID:</span> {image.id}
              </p>
              <p>
                <span className="font-medium">Uploaded Time:</span>{' '}
                {new Date(image.uploadedAt * 1000).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Uploaded By:</span>{' '}
                {image.uploadedUserId}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Aliases of this image:
              </h3>
              <div className="space-y-2">
                {aliases.map((alias) => (
                  <div key={alias} className="flex items-center gap-2">
                    {(
                      <button
                        onClick={() => handleRemoveAlias(alias)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                    <input
                      type="text"
                      value={alias}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                ))}
                {(
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddAlias}
                      className="text-green-600 hover:text-green-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                    <input
                      type="text"
                      placeholder="Add a new alias"
                      value={newAlias}
                      onChange={(e) => setNewAlias(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddAlias()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div>
              {(
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  Delete Image
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
              {(
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}