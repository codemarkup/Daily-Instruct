import Image, { ImageProps } from 'next/image';
import React from 'react';
import { getAdaptiveCloudinaryUrl, getBlurDataUrl } from '@/lib/cloudinary';

export default async function AdaptiveImage({ src, alt, priority = false, ...props }: ImageProps) {
  const srcString = typeof src === 'string' ? src : '';
  
  // If it's a Cloudinary URL, fetch the adaptive version and blur placeholder
  const isCloudinary = srcString.includes('res.cloudinary.com');
  
  let finalSrc = src;
  let blurDataURL = props.blurDataURL;
  let placeholder = props.placeholder || 'empty';
  
  if (isCloudinary) {
    finalSrc = await getAdaptiveCloudinaryUrl(srcString);
    
    if (!blurDataURL) {
      const generatedBlur = await getBlurDataUrl(srcString);
      if (generatedBlur) {
        blurDataURL = generatedBlur;
        placeholder = 'blur';
      }
    }
  }

  // Ensure explicit dimensions exist either via width/height or fill
  // (Next.js Image requires this anyway, but we just pass props)

  return (
    <Image
      src={finalSrc}
      alt={alt || ''}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      {...props}
    />
  );
}
