import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileExplorer from './FileExplorer';
import apiClient from '../../services/api';

jest.mock('../../services/api');

describe('FileExplorer', () => {
    beforeEach(() => {
        // Mock API responses
        (apiClient.get as jest.Mock).mockImplementation((url) => {
        if (url === '/api/directories') {
            return Promise.resolve({
            data: {
                data: {
                directories: ['projects', 'shared']
                }
            }
            });
        }
        if (url === '/api/files') {
            return Promise.resolve({
            data: {
                files: [
                { name: 'file1.sql', path: 'path/to/file1.sql', isDirectory: false, type: 'sql' },
                { name: 'dir1', path: 'path/to/dir1', isDirectory: true }
                ]
            }
            });
        }
        return Promise.reject(new Error('Unknown API endpoint'));
        });
        
        // Clear localStorage
        localStorage.clear();
    });

    it('shows directory picker when no session data exists', async () => {
        render(<FileExplorer />);
        
        await waitFor(() => {
        expect(screen.getByText('Select Working Directory')).toBeInTheDocument();
        expect(screen.getByText('Drag & Drop a folder here')).toBeInTheDocument();
        });
    });

    it('loads directory contents after selecting a directory', async () => {
        render(<FileExplorer />);
        
        await waitFor(() => {
        expect(screen.getByText('projects')).toBeInTheDocument();
        });
        
        userEvent.click(screen.getByText('projects'));
        
        await waitFor(() => {
        expect(screen.getByText('file1.sql')).toBeInTheDocument();
        expect(screen.getByText('dir1')).toBeInTheDocument();
        });
    });

    it('shows favorites section', async () => {
        localStorage.setItem('fileExplorerFavorites', JSON.stringify([
        { name: 'fav1.sql', path: 'path/to/fav1.sql', isDirectory: false }
        ]));
        
        localStorage.setItem('lastBasePath', 'projects');
        localStorage.setItem('lastDirectory', 'path/to');
        
        render(<FileExplorer />);
        
        await waitFor(() => {
        expect(screen.getByText('Favorites')).toBeInTheDocument();
        expect(screen.getByText('fav1.sql')).toBeInTheDocument();
        });
    });
});