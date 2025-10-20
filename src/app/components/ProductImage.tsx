'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * ProductImage Component
 * 
 * A robust image component with fallback handling for:
 * - Null/undefined/empty image URLs
 * - Image loading errors
 * - Displays a custom placeholder instead of broken images
 */
export default function ProductImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  className = '',
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  // Check if we have a valid image source
  const hasValidSrc = src && src.trim() !== '';

  // If no valid source or if image failed to load, show placeholder
  if (!hasValidSrc || imageError) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center ${fill ? 'absolute inset-0' : ''} ${className}`}>
        {/* Icon placeholder */}
        <svg
          className="w-16 h-16 text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-gray-500 text-sm font-medium">No Image Available</span>
      </div>
    );
  }

  // Render the Next.js Image component with error handling
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        onError={() => setImageError(true)}
      />
    );
  }

  // For non-fill images, width and height are required
  if (!width || !height) {
    console.warn('ProductImage: width and height are required when fill is false');
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Invalid image dimensions</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}

