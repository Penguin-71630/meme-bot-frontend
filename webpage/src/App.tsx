import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import ImageModal from './components/ImageModal';
import UploadModal from './components/UploadModal';
import Pagination from './components/Pagination';
import { api, ALIASES_PER_PAGE } from './api-mock';
import type { Image } from './types';

function App() {
  const [images, setImages] = useState<Image[]>([]);
  const [allAliases, setAllAliases] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  useEffect(() => {
    // Reset to page 1 when search query changes
    setCurrentPage(1);
  }, [searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [imagesData, aliasesData] = await Promise.all([
        api.getImages({
          search: searchQuery || undefined,
        }),
        api.getAllAliases(),
      ]);
      
      setImages(imagesData);
      setAllAliases(aliasesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File, aliases: string[]) => {
    await api.uploadImage(file, aliases);
    await loadData();
  };

  const handleSaveImage = async (imageId: string, aliases: string[]) => {
    await api.updateImageAliases(imageId, aliases);
    await loadData();
  };

  const handleDeleteImage = async (imageId: string) => {
    await api.deleteImage(imageId);
    await loadData();
  };

  // Filter aliases based on search
  const filteredAliases = searchQuery
    ? allAliases.filter(alias =>
        alias.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allAliases;

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredAliases.length / ALIASES_PER_PAGE));
  const startIndex = (currentPage - 1) * ALIASES_PER_PAGE;
  const endIndex = startIndex + ALIASES_PER_PAGE;
  const currentPageAliases = filteredAliases.slice(startIndex, endIndex);

  // Filter images to only show those with current page aliases
  const currentPageImages = images.filter(img =>
    img.aliases.some(alias => currentPageAliases.includes(alias)) ||
    (img.aliases.length === 0 && currentPageAliases.length > 0)
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar onUploadClick={() => setShowUploadModal(true)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          aliases={currentPageAliases}
          currentPage={currentPage}
          totalPages={totalPages}
        />
        <main className="flex-1 overflow-y-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          {/* Top Pagination */}
          {!loading && totalPages > 1 && (
            <div className="border-b border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : (
            <ImageGrid
              images={currentPageImages}
              aliases={currentPageAliases}
              onImageClick={setSelectedImage}
            />
          )}

          {/* Bottom Pagination */}
          {!loading && totalPages > 1 && (
            <div className="border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </div>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onSave={handleSaveImage}
          onDelete={handleDeleteImage}
        />
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}

export default App;

// import { useState, useEffect } from 'react';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import SearchBar from './components/SearchBar';
// import ImageGrid from './components/ImageGrid';
// import ImageModal from './components/ImageModal';
// import UploadModal from './components/UploadModal';
// import { api } from './api-mock';
// import type { Image } from './types';

// function App() {
//   const [images, setImages] = useState<Image[]>([]);
//   const [allAliases, setAllAliases] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedAlias, setSelectedAlias] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<Image | null>(null);
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadData();
//   }, [searchQuery, selectedAlias]);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const [imagesData, aliasesData] = await Promise.all([
//         api.getImages({
//           search: searchQuery || undefined,
//           null_alias: selectedAlias === null ? true : undefined,
//         }),
//         api.getAllAliases(),
//       ]);
      
//       let filteredImages = imagesData;
//       if (selectedAlias) {
//         filteredImages = imagesData.filter((img) =>
//           img.aliases.includes(selectedAlias)
//         );
//       } else if (selectedAlias === null) {
//         filteredImages = imagesData.filter((img) => img.aliases.length === 0);
//       }
      
//       setImages(filteredImages);
//       setAllAliases(aliasesData);
//     } catch (error) {
//       console.error('Failed to load data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpload = async (file: File, aliases: string[]) => {
//     await api.uploadImage(file, aliases);
//     await loadData();
//   };

//   const handleSaveImage = async (imageId: string, aliases: string[]) => {
//     await api.updateImageAliases(imageId, aliases);
//     await loadData();
//   };

//   const handleDeleteImage = async (imageId: string) => {
//     await api.deleteImage(imageId);
//     await loadData();
//   };

//   return (
//     <div className="h-screen flex flex-col">
//       <Navbar
//         onUploadClick={() => setShowUploadModal(true)}
//       />
//       <div className="flex-1 flex overflow-hidden">
//         <Sidebar
//           aliases={allAliases}
//           selectedAlias={selectedAlias}
//           onAliasClick={setSelectedAlias}
//         />
//         <main className="flex-1 overflow-y-auto">
//           <SearchBar value={searchQuery} onChange={setSearchQuery} />
//           {loading ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="text-gray-500">Loading...</div>
//             </div>
//           ) : (
//             <ImageGrid images={images} onImageClick={setSelectedImage} />
//           )}
//         </main>
//       </div>

//       {selectedImage && (
//         <ImageModal
//           image={selectedImage}
//           onClose={() => setSelectedImage(null)}
//           onSave={handleSaveImage}
//           onDelete={handleDeleteImage}
//         />
//       )}

//       {showUploadModal && (
//         <UploadModal
//           onClose={() => setShowUploadModal(false)}
//           onUpload={handleUpload}
//         />
//       )}
//     </div>
//   );
// }

// export default App;