/**
 * MediaService Abstraction
 * 
 * Manages media assets across the portfolio and CMS.
 * Currently uses direct URL references with validation and caching helpers,
 * designed for seamless transition to Firebase Storage (or S3/Cloudinary)
 * without restructuring database documents.
 */

export interface MediaAsset {
  id?: string;
  url: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  altText?: string;
  uploadedAt: string;
}

export interface MediaUploadOptions {
  folder?: string;
  customFileName?: string;
  maxSizeBytes?: number;
}

class MediaService {
  /**
   * Validates whether a provided URL looks like a valid image or file format.
   */
  public isValidMediaUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    return (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('data:image/') ||
      trimmed.startsWith('/')
    );
  }

  /**
   * Cleans and normalizes URLs.
   */
  public normalizeUrl(url: string): string {
    if (!url) return '';
    return url.trim();
  }

  /**
   * Future-proof upload abstraction.
   * Currently takes an external URL or direct file reference and returns the canonical URL.
   * When Firebase Storage billing is enabled, this will invoke Firebase Storage `uploadBytesResumable`.
   */
  public async uploadMedia(
    source: File | string,
    options?: MediaUploadOptions
  ): Promise<string> {
    if (typeof source === 'string') {
      if (!this.isValidMediaUrl(source)) {
        throw new Error('Please enter a valid HTTP or HTTPS media URL.');
      }
      return this.normalizeUrl(source);
    }

    // If a File object is passed while Storage is on URL-mode:
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(source);
    });
  }

  /**
   * Standard fallback image for portfolio cards and thumbnails.
   */
  public getDefaultPlaceholder(category: string = 'project'): string {
    switch (category.toLowerCase()) {
      case 'avatar':
        return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
      case 'blog':
        return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';
      case 'gallery':
        return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
      case 'project':
      default:
        return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
    }
  }
}

export const mediaService = new MediaService();
