export interface Image {
  id: string;
  uploaded_user_id: string;
  uploaded_at: string;
  aliases: string[];
  url: string;
}

export interface User {
  id: string;
  username: string;
}