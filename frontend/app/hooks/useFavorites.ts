import { useState, useEffect } from 'react';
import { FavoriteImage } from "@/app/types";

const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteImage[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [errorFavorites, setErrorFavorites] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setLoadingFavorites(true);
    setErrorFavorites(null);
    try {
      const response = await fetch('/favorites');
      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (error: any) {
      setErrorFavorites('Failed to fetch favorites');
    } finally {
      setLoadingFavorites(false);
    }
  };

  const toggleFavorite = async (image: any) => {
    try {
      await fetch('/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });
      await fetchFavorites(); // Re-fetch favorites to update the list
    } catch (error: any) {
      setErrorFavorites('Failed to toggle favorite');
    }
  };

  const generateShareCode = async () => {
    try {
      const response = await fetch('/generate_share');
      const data = await response.json();
      return data.share_code;
    } catch (error: any) {
      setErrorFavorites('Failed to generate share code');
    }
  };

  const loadSharedFavorites = async (shareCode: string) => {
    setErrorFavorites(null);
      try {
        const response = await fetch(`/share/\${shareCode}`);
      const data = await response.json();
      setFavorites(data.favorites || []);
      return data;
    } catch (error: any) {
      setErrorFavorites('Failed to load shared favorites');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loadingFavorites,
    errorFavorites,
    fetchFavorites,
    toggleFavorite,
    generateShareCode,
    loadSharedFavorites,
  };
};

export default useFavorites;
