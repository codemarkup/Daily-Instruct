import { headers } from 'next/headers';

const blurCache = new Map<string, string>();

/**
 * Transforms a Cloudinary URL to include adaptive quality/format based on connection headers.
 */
export async function getAdaptiveCloudinaryUrl(originalUrl: string): Promise<string> {
  if (!originalUrl || !originalUrl.includes('res.cloudinary.com')) return originalUrl;

  try {
    const headersList = await headers();
    const saveData = headersList.get('save-data') === 'on';
    const ect = headersList.get('ect');
    const isSlow = saveData || ect === 'slow-2g' || ect === '2g' || ect === '3g';

    const uploadIndex = originalUrl.indexOf('/upload/');
    if (uploadIndex === -1) return originalUrl;
    
    const baseUrl = originalUrl.substring(0, uploadIndex + 8);
    const imagePath = originalUrl.substring(uploadIndex + 8);
    
    const transforms = isSlow ? 'f_auto,q_auto:eco' : 'f_auto,q_auto';
    
    return `${baseUrl}${transforms}/${imagePath}`;
  } catch (e) {
    // If headers() fails (e.g. called from a client context unexpectedly), fallback to default
    return originalUrl;
  }
}

/**
 * Generates a base64 blurDataURL by fetching a highly compressed, tiny version from Cloudinary.
 */
export async function getBlurDataUrl(originalUrl: string): Promise<string | undefined> {
  if (!originalUrl || !originalUrl.includes('res.cloudinary.com')) return undefined;
  
  const uploadIndex = originalUrl.indexOf('/upload/');
  if (uploadIndex === -1) return undefined;
  
  const baseUrl = originalUrl.substring(0, uploadIndex + 8);
  const imagePath = originalUrl.substring(uploadIndex + 8);
  
  const blurUrl = `${baseUrl}e_blur:1000,f_auto,w_100,q_1/${imagePath}`;
  
  if (blurCache.has(blurUrl)) return blurCache.get(blurUrl);
  
  try {
    const res = await fetch(blurUrl, { cache: 'force-cache' });
    if (!res.ok) return undefined;
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mime = res.headers.get('content-type') || 'image/jpeg';
    const dataUrl = `data:${mime};base64,${base64}`;
    blurCache.set(blurUrl, dataUrl);
    return dataUrl;
  } catch (e) {
    return undefined;
  }
}
