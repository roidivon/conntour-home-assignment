import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { ImageData } from '../../types.ts';
import { getImages } from '../../api.ts';

export const useGallery = () => {
  const { pathname } = useLocation();
  const searchId = pathname.slice(1);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const { data, error } = useQuery<ImageData[]>({
    queryKey: ['images', searchId],
    queryFn: getImages,
    retry: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const currentImage = currentImageIndex !== null ? data?.[currentImageIndex] : null;
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsLoadingImages(true);
  }, [searchId]);
  useEffect(() => {
    const loadImages = async () => {
      setIsLoadingImages(true);
      await Promise.all(
        data!.map(({ image_url }) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = image_url;
            img.onload = resolve;
          });
        }),
      );
      setIsLoadingImages(false);
    };
    if (data?.length) {
      loadImages();
    }
  }, [data]);
  useEffect(() => {
    if (currentImageIndex == null || !data?.length) {
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      let newIndex;
      switch (e.key) {
        case 'ArrowLeft':
          newIndex = Math.max(currentImageIndex - 1, 0);
          break;
        case 'ArrowRight':
          newIndex = Math.min(currentImageIndex + 1, data.length - 1);
          break;
        default:
          return;
      }
      setCurrentImageIndex(newIndex);
      document.getElementById(String(data[newIndex].id))?.scrollIntoView({ behavior: 'smooth' });
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [data, currentImageIndex]);
  useEffect(() => {
    if (data && !currentImageIndex) {
      setCurrentImageIndex(0);
      rootRef.current?.focus();
    }
  }, [data, currentImageIndex]);
  const handleImageClick = (index: number) => setCurrentImageIndex(index);
  return {
    isLoading: isLoadingImages,
    data,
    error,
    currentImage,
    rootRef,
    handleImageClick,
  };
};
