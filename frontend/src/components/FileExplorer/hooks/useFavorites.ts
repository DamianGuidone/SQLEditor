import { useState, useEffect } from 'react';
import { FileSystemItem, FavoriteItem } from '../types/explorerTypes';

const useFavorites = (currentBasePath: string) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    useEffect(() => {
        const savedFavorites = localStorage.getItem('fileExplorerFavorites');
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (e) {
                console.error('Failed to parse favorites', e);
            }
        }
    }, []);

    const saveFavorites = (newFavorites: FavoriteItem[]) => {
        setFavorites(newFavorites);
        localStorage.setItem('fileExplorerFavorites', JSON.stringify(newFavorites));
    };

    const addFavorite = (item: FileSystemItem) => {
        if (!favorites.some(fav => fav.path === `${currentBasePath}/${item.path}`)) {
            const newFavorite: FavoriteItem = {
                name: item.name,
                path: `${currentBasePath}/${item.path}`,
                isDirectory: item.isDirectory
            };
            saveFavorites([...favorites, newFavorite]);
        }
    };

    const removeFavorite = (path: string) => {
        saveFavorites(favorites.filter(fav => fav.path !== path));
    };

    const addFavoriteFolder = (folder: FavoriteItem) => {
        if (!favorites.some(fav => fav.path === folder.path)) {
            saveFavorites([...favorites, folder]);
        }
    };

    return {
        favorites,
        addFavorite,
        removeFavorite,
        addFavoriteFolder,
    };
};

export default useFavorites;