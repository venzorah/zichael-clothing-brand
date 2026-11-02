export const MAX_ADMIN_IMAGE_BYTES = 1.5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

// Reads an image chosen by an administrator into a data URL for preview and storage.
// In production these uploads go to Cloudinary and only the hosted URL is saved.
export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!ACCEPTED.includes(file.type)) return reject(new Error('Use a JPG, PNG or WEBP image.'));
    if (file.size > MAX_ADMIN_IMAGE_BYTES) return reject(new Error('Images must be 1.5 MB or smaller. Paste a hosted image URL for larger files.'));
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read this file.'));
    reader.readAsDataURL(file);
  });
}

export function slugify(text: string): string {
  return text.
  toLowerCase().
  normalize('NFKD').
  replace(/[\u0300-\u036f]/g, '').
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-+|-+$/g, '');
}