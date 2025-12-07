import type { Image } from './types';

const API_BASE_URL = 'http://localhost:8080';

// Pagination configuration
export const ALIASES_PER_PAGE = 5; // Number of aliases to show per page

class ApiService {
  // Images
  async getImages(params?: {
    search?: string;
    null_alias?: boolean;
    limit?: number;
    page?: number;
  }): Promise<Image[]> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.null_alias) queryParams.append('null_alias', 'true');
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const response = await fetch(
      `${API_BASE_URL}/api/images?${queryParams}`
    );
    if (!response.ok) throw new Error('Failed to fetch images');
    const data = await response.json();
    return data.images || [];
  }

  async getImage(id: string): Promise<Image> {
    const response = await fetch(`${API_BASE_URL}/api/images/${id}`);
    if (!response.ok) throw new Error('Failed to fetch image');
    return response.json();
  }

  async uploadImage(file: File, aliases: string[]): Promise<Image> {
    const formData = new FormData();
    formData.append('imgfile', file);
    aliases.forEach((alias) => formData.append('aliases', alias));

    const response = await fetch(`${API_BASE_URL}/api/images`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  }

  async deleteImage(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/images/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete image');
  }

  // Aliases
  async getAllAliases(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/aliases`);
    if (!response.ok) throw new Error('Failed to fetch aliases');
    const data = await response.json();
    return data.aliases || [];
  }

  async updateImageAliases(id: string, aliases: string[]): Promise<Image> {
    const response = await fetch(`${API_BASE_URL}/api/images/${id}/aliases`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ aliases }),
    });
    if (!response.ok) throw new Error('Failed to update aliases');
    return response.json();
  }

  async addImageAlias(id: string, alias: string): Promise<Image> {
    const response = await fetch(`${API_BASE_URL}/api/images/${id}/aliases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alias }),
    });
    if (!response.ok) throw new Error('Failed to add alias');
    return response.json();
  }

  async removeImageAlias(id: string, alias: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/images/${id}/aliases?alias=${encodeURIComponent(alias)}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) throw new Error('Failed to remove alias');
  }

  getImageUrl(id: string): string {
    return `${API_BASE_URL}/api/images/${id}/file`;
  }
}

export const api = new ApiService();