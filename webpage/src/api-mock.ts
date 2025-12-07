import type { Image } from './types';
import fakeDb from './assets/tests/fakedb.json';

export const ALIASES_PER_PAGE = 5;

class MockApiService {
  private images: Image[] = [];
  private nextId: number = 18;

  constructor() {
    // Load initial data from fakedb.json
    this.images = JSON.parse(JSON.stringify(fakeDb.images));
  }

  // Helper to simulate network delay
  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Images
  async getImages(params?: {
    search?: string;
    null_alias?: boolean;
    limit?: number;
    page?: number;
  }): Promise<Image[]> {
    await this.delay();
    
    let filtered = [...this.images];

    // Filter by search query (search in aliases)
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(img =>
        img.aliases.some(alias => alias.toLowerCase().includes(searchLower))
      );
    }

    // Filter images without aliases
    if (params?.null_alias) {
      filtered = filtered.filter(img => img.aliases.length === 0);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;

    return filtered.slice(start, end);
  }

  async getImage(id: string): Promise<Image> {
    await this.delay();
    
    const image = this.images.find(img => img.id === id);
    if (!image) {
      throw new Error('Image not found');
    }
    return { ...image };
  }

  async uploadImage(file: File, aliases: string[]): Promise<Image> {
    await this.delay(500);
    
    // Create a new image object
    const newImage: Image = {
      id: String(this.nextId++),
      uploaded_user_id: 'konchin.shih',
      uploaded_at: new Date().toISOString(),
      aliases: aliases,
      url: `/api/images/${this.nextId - 1}/file`,
    };

    this.images.push(newImage);
    return { ...newImage };
  }

  async deleteImage(id: string): Promise<void> {
    await this.delay();
    
    const index = this.images.findIndex(img => img.id === id);
    if (index === -1) {
      throw new Error('Image not found');
    }
    this.images.splice(index, 1);
  }

  // Aliases
  async getAllAliases(): Promise<string[]> {
    await this.delay();
    
    // Get unique aliases from all images
    const aliasSet = new Set<string>();
    this.images.forEach(img => {
      img.aliases.forEach(alias => aliasSet.add(alias));
    });
    return Array.from(aliasSet).sort();
  }

  async updateImageAliases(id: string, aliases: string[]): Promise<Image> {
    await this.delay();
    
    const image = this.images.find(img => img.id === id);
    if (!image) {
      throw new Error('Image not found');
    }
    image.aliases = [...aliases];
    return { ...image };
  }

  async addImageAlias(id: string, alias: string): Promise<Image> {
    await this.delay();
    
    const image = this.images.find(img => img.id === id);
    if (!image) {
      throw new Error('Image not found');
    }
    if (!image.aliases.includes(alias)) {
      image.aliases.push(alias);
    }
    return { ...image };
  }

  async removeImageAlias(id: string, alias: string): Promise<void> {
    await this.delay();
    
    const image = this.images.find(img => img.id === id);
    if (!image) {
      throw new Error('Image not found');
    }
    image.aliases = image.aliases.filter(a => a !== alias);
  }

  getImageUrl(id: string): string {
    // For mock, return a placeholder image URL
    return `https://picsum.photos/seed/${id}/400/400`;
  }
}

export const api = new MockApiService();