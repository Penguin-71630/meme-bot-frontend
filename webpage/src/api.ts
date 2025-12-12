import type { Image, Alias } from './types';

const API_BASE_URL = import.meta.env.EXTERNAL_URL || 'http://localhost:8080';

// Pagination configuration
export const ALIASES_PER_PAGE = 10; // Number of aliases to show per page

class ApiService {
  // Authentication
  async login(token: string): Promise<void> {
    console.log("Hello, someone is trying to access the web page.");
    console.log("Token: ", token);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // IMPORTANT: Allows cookies to be set
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Login failed");
      throw new Error(errorText || 'Login failed');
    }
    console.log("Login successful");
  }

  // GET /api/images?images=1,2,3&aliases=1,2,3
  // Returns: Image[] with {id, uploadedUserId, uploadedAt, aliasesIds, extension}
  async getImages(params?: {
    imageIds?: number[];
    aliasIds?: number[];
  }): Promise<Image[]> {
    const queryParams = new URLSearchParams();
    if (params?.imageIds && params.imageIds.length > 0) {
      queryParams.append('images', params.imageIds.join(','));
    }
    if (params?.aliasIds && params.aliasIds.length > 0) {
      queryParams.append('aliases', params.aliasIds.join(','));
    }

    const response = await fetch(
      `${API_BASE_URL}/api/images?${queryParams}`,
      { credentials: 'include' }
    );
    if (!response.ok) throw new Error('Failed to fetch images');
    const data = await response.json();
    return data || [];
  }

  // GET /api/images?images={id}
  // Returns single image by querying with image ID
  async getImage(id: number): Promise<Image> {
    const response = await fetch(`${API_BASE_URL}/api/images?images=${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch image');
    const data = await response.json();
    return data[0];
  }

  // POST /api/image
  // Content-Type: image/png, image/jpeg, image/gif
  // Returns: {id, uploadedUserId, uploadedAt, extension}
  async uploadImage(file: File): Promise<Image> {
    const response = await fetch(`${API_BASE_URL}/api/image`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
      },
      credentials: 'include',
      body: file,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    const result = await response.json();
    // Convert uploadedAt from string to number if needed
    return {
      ...result,
      aliasesIds: [],
      uploadedAt: typeof result.uploadedAt === 'string' 
        ? new Date(result.uploadedAt).getTime() / 1000
        : result.uploadedAt
    };
  }

  // DELETE /api/image/{id}
  // Deletes image along with the links
  async deleteImage(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/image/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete image');
  }

  // GET /api/aliases
  // Returns: Alias[] with {id, name}
  async getAllAliases(): Promise<Alias[]> {
    const response = await fetch(`${API_BASE_URL}/api/aliases`, {
      credentials: 'include',
    });
    if (!response.ok) {
      console.log("Failed to fetch aliases");
      throw new Error('Failed to fetch aliases');
    }
    const data = await response.json();
    return data || [];
  }

  // PUT /api/image/{id}/aliases
  // Body: {aliases: string[]}
  async updateImageAliases(id: number, aliasNames: string[]): Promise<void> {
    console.log("Update aliases of image ", id);
    console.log("Alias names: ", aliasNames);
    const response = await fetch(`${API_BASE_URL}/api/image/${id}/aliases`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ aliases: aliasNames }),
    });
    if (!response.ok) throw new Error('Failed to update aliases');
  }

  // DELETE /api/alias/{id}
  // Deletes alias along with the links
  async deleteAlias(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/alias/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete alias');
  }

  // Construct image URL from image ID and extension
  // Format: /img/{id}.{extension}
  getImageUrl(id: number, extension: string): string {
    return `${API_BASE_URL}/img/${id}.${extension}`;
  }
}

export const api = new ApiService();