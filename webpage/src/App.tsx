import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import ImageModal from './components/ImageModal';
import UploadModal from './components/UploadModal';
import Pagination from './components/Pagination';
import ErrorModal from './components/ErrorModal';
import Login from './pages/Login';
import { api, ALIASES_PER_PAGE } from './api';
import type { Image, Alias } from './types';

function App() {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [shouldLoadData, setShouldLoadData] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [allAliases, setAllAliases] = useState<Alias[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
          // Exit login mode and allow data loading
          setIsLoginMode(false);
          setIsInitializing(false);
          setShouldLoadData(true);
        })
        .catch((error) => {
          console.error("Login failed:", error);
          // Show error modal instead of redirecting
          setLoginError("Login error");
          setIsInitializing(false);
        });
    } else {
      setIsInitializing(false);
      setShouldLoadData(true);
    }
  }, []);

  useEffect(() => {
    // Reset to page 1 when search query changes
    setCurrentPage(1);
  }, [searchQuery]);

  const loadData = useCallback(async () => {
    if (loginError) return; // Don't load if there's a login error
    
    setLoading(true);
    try {
      const aliasesData = await api.getAllAliases();
      aliasesData.sort((a, b) => a.name.localeCompare(b.name));
      setAllAliases(aliasesData);
      
      // Get images for all aliases or filtered aliases using subarray matching
      const matchesSubarray = (text: string, query: string): boolean => {
        let queryIndex = 0;
        for (let i = 0; i < text.length; i++) {
          if (queryIndex === query.length) break;
          if (text[i].toLowerCase() === query[queryIndex].toLowerCase()) {
            queryIndex++;
          }
        }
        return queryIndex === query.length;
      };
      
      const aliasIds = searchQuery
        ? aliasesData.filter(a => matchesSubarray(a.name, searchQuery)).map(a => a.id)
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
  }, [searchQuery, loginError]);

  useEffect(() => {
    // Load data when shouldLoadData is true and not in login mode or initializing
    if (shouldLoadData && !isLoginMode && !isInitializing && !loginError) {
      loadData();
    }
  }, [shouldLoadData, isLoginMode, isInitializing, loginError, loadData]);

  // Filter aliases based on search - using subarray matching
  const matchesSubarray = (text: string, query: string): boolean => {
    let queryIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      if (queryIndex === query.length) break; // Early exit when all query chars matched
      if (text[i].toLowerCase() === query[queryIndex].toLowerCase()) {
        queryIndex++;
      }
    }

    console.log(query, text, queryIndex);
    if (queryIndex === query.length) {
      console.log("Matched with " + query + ": " + text);
    }
    
    return queryIndex === query.length;
  };

  const filteredAliases = searchQuery
    ? allAliases.filter(alias => matchesSubarray(alias.name, searchQuery))
    : allAliases;

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredAliases.length / ALIASES_PER_PAGE));
  
  // Adjust current page if it's now out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

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

  // Show error modal if login failed - don't load page elements
  if (loginError) {
    return (
      <ErrorModal
        message={loginError}
        onClose={() => {
          setLoginError(null);
          window.location.href = '/';
        }}
      />
    );
  }

  // Show login page if in login mode
  if (isLoginMode) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Don't render page while initializing
  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }
  
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