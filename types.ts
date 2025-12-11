export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  socialLink: string;
  qrCode1: string;
  qrCode2: string;
}

export interface AppData {
  profile: ProfileData;
  portraitPhotos: Photo[];
  landscapePhotos: Photo[];
}
