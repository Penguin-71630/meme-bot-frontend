import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import ImageModal from './components/ImageModal';
import UploadModal from './components/UploadModal';
import Pagination from './components/Pagination';
import Login from './pages/Login';
import { api, ALIASES_PER_PAGE } from './api';
import type { Image, Alias } from './types';

function App() {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [allAliases, setAllAliases] = useState<Alias[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("Hello");

  // Check if URL has a login token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      console.log("Access token: ", token);
      // Call the login API to set the refresh_token cookie
      api.login(token)
        .then(() => {
          console.log("Login successful");
          // Remove token from URL for security
          window.history.replaceState({}, document.title, '/');
          // Exit login mode and load data
          setIsLoginMode(false);
          loadData();
        })
        .catch((error) => {
          console.error("Login failed:", error);
          setIsLoginMode(true); // Show login page on error
        });
    } else {
      loadData();
    }
  }, []);

  useEffect(() => {
    if (!isLoginMode) {
      loadData();
    }
  }, [searchQuery, isLoginMode]);

  useEffect(() => {
    // Reset to page 1 when search query changes
    setCurrentPage(1);
  }, [searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const aliasesData = await api.getAllAliases();
      setAllAliases(aliasesData);
      
      // Get images for all aliases or filtered aliases
      const aliasIds = searchQuery
        ? aliasesData.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map(a => a.id)
        : aliasesData.map(a => a.id);
      
      const imagesData = aliasIds.length > 0 
        ? await api.getImages({ aliasIds })
        : [];
      
      setImages(imagesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginMode(false);
    loadData();
  };

  const handleUpload = async (file: File, aliases: string[]) => {
    console.log("Trying to upload image:");
    console.log(file.name);
    console.log(aliases);
    const image = await api.uploadImage(file);
    if (aliases.length > 0) {
      await api.updateImageAliases(image.id, aliases);
    }
    await loadData();
  };

  const handleSaveImage = async (imageId: number, aliases: string[]) => {
    await api.updateImageAliases(imageId, aliases);
    await loadData();
  };

  const handleDeleteImage = async (imageId: number) => {
    await api.deleteImage(imageId);
    await loadData();
  };

  // Show login page if in login mode
  if (isLoginMode) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Filter aliases based on search
  const filteredAliases = searchQuery
    ? allAliases.filter(alias =>
        alias.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allAliases;

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredAliases.length / ALIASES_PER_PAGE));
  const startIndex = (currentPage - 1) * ALIASES_PER_PAGE;
  const endIndex = startIndex + ALIASES_PER_PAGE;
  const currentPageAliases = filteredAliases.slice(startIndex, endIndex);

  // Filter images to only show those with current page aliases
  const currentPageAliasIds = currentPageAliases.map(a => a.id);
  const currentPageImages = images.filter(img =>
    img.aliasesIds.some(aliasId => currentPageAliasIds.includes(aliasId)) ||
    (img.aliasesIds.length === 0 && currentPageAliases.length > 0)
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