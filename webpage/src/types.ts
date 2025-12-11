export interface Alias {
  id: number;
  name: string;
}

export interface Image {
  id: number;
  uploadedUserId: string;
  uploadedAt: number;
  aliasesIds: number[];
  extension: string;
}