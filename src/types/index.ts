export interface Profile {
  id?: string;
  fullName: string;
  title: string;
  headline: string;
  bio: string;
  aboutStory: string[];
  avatarUrl: string;
  location: string;
  email: string;
  phone?: string;
  availableForHire: boolean;
  resumeUrl: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  highlights: {
    title: string;
    value: string;
    description: string;
  }[];
  updatedAt?: any;
}

export interface Project {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  completionDate: string;
  displayOrder: number;
  status: 'published' | 'draft';
  createdAt?: any;
  updatedAt?: any;
}

export interface Skill {
  id?: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud & DevOps' | 'Design & Tools' | string;
  description?: string;
  proficiency: number; // 0 to 100
  levelLabel?: 'Familiar' | 'Proficient' | 'Advanced' | 'Expert' | string;
  iconName?: string;
  displayOrder: number;
  isTopSkill: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Experience {
  id?: string;
  organization: string;
  position: string;
  description: string[];
  startDate: string; // e.g. "2022-03"
  endDate?: string; // e.g. "Present" or "2024-01"
  isCurrent: boolean;
  technologies: string[];
  location: string;
  locationType: 'Remote' | 'On-site' | 'Hybrid';
  displayOrder: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Education {
  id?: string;
  institution: string;
  qualification: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  displayOrder: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Service {
  id?: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
  displayOrder: number;
  featured: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface GalleryItem {
  id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  date: string;
  featured: boolean;
  tags: string[];
  displayOrder: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown
  featuredImageUrl: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt?: string;
  status: 'published' | 'draft';
  viewsCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived' | 'replied';
  replyNotes?: string;
  createdAt?: any;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  ogImageUrl?: string;
  contactEmail: string;
  footerText: string;
  primaryDomain?: string;
  updatedAt?: any;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'editor' | 'viewer';
  isAdmin: boolean;
}
