"use client";

import React from 'react';
import { FavoriteImage } from "@/app/types"; // Import FavoriteImage interface
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import useFavorites from "@/app/hooks/useFavorites";

const FavoritesModal = () => {
  const { favorites, loadingFavorites, errorFavorites, fetchFavorites, toggleFavorite, generateShareCode, loadSharedFavorites } = useFavorites();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm hover:text-purple-200 transition-colors">Favorites</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Favorite Pictures</DialogTitle>
          <DialogDescription>
            Manage and share your favorite reverse image search results.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {loadingFavorites && <p>Loading favorites...</p>}
          {errorFavorites && <p className="text-red-500">Error: {errorFavorites}</p>}
          </div> 
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            {favorites && favorites.length > 0 ? (
              favorites.map((favorite: FavoriteImage) => (
                <div key={favorite.url} className="relative">
                  <img
                    src={favorite.thumbnail || favorite.url}
                    alt={favorite.title || 'Favorite Image'}
                    className="rounded-md aspect-square object-cover w-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-90 transition-opacity duration-200 bg-black bg-opacity-50 rounded-md">
                    <a
                      href={favorite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-sm p-2 rounded-md bg-purple-600 hover:bg-purple-700"
                    >
                      Open Source
                    </a>
                  </div>
                </div>
              ))
            ) : (
              !loadingFavorites && <p>No favorites yet.</p>
            )}
             {loadingFavorites && <p>Loading favorites...</p>}
          </div>
         <DialogFooter>
          <button type="button" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary hover:text-secondary-foreground h-10 px-4 py-2">
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesModal;
