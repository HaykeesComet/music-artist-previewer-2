import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock the fetch function globally
global.fetch = jest.fn((url) => {
  if (url.includes('/api/favorites')) {
    // Mocking the fetchFavorites response to return empty favorites after logout
    return Promise.resolve({
      json: () => Promise.resolve([]),
    });
  }
  return Promise.resolve({
    json: () => Promise.resolve({}),
  });
});

// Clear the mock and localStorage before each test
beforeEach(() => {
  fetch.mockClear();
  localStorage.clear();
});

describe('App Component', () => {
  test('renders the main components', () => {
    render(<App />);

    // Check for the logo and navigation links
    expect(screen.getByText(/Music Artist Previewer/i)).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();

    // Check for the main heading and search input
    expect(screen.getByText(/Remind Me Quick Who Is\?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Preview a Music Artist/i)).toBeInTheDocument();
  });

  test('allows user to search for an artist', async () => {
    // Mocking the artist search response
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              artists: {
                total: 1,
                items: [
                  {
                    id: 'artist_id',
                    name: 'Adele',
                    images: [{ url: 'image_url' }],
                    followers: { total: 1000000 },
                    genres: ['pop', 'soul'],
                  },
                ],
              },
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              tracks: [
                {
                  id: 'track_id',
                  name: 'Hello',
                  preview_url: 'preview_url',
                  album: { images: [{ url: 'album_image_url' }] },
                },
              ],
            }),
        })
      );

    render(<App />);

    // Enter artist name and trigger search
    fireEvent.change(screen.getByPlaceholderText(/Preview a Music Artist/i), {
      target: { value: 'Adele' },
    });
    fireEvent.click(screen.getAllByText(/Search/i)[0]);

    // Wait for artist name and tracks to appear
    await waitFor(() => expect(screen.getByText(/Adele/i)).toBeInTheDocument());
    expect(screen.getByText(/1,000,000 followers/i)).toBeInTheDocument();
    expect(screen.getByText(/pop, soul/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  });

  test('handles artist not found error', async () => {
    // Mock the fetch response for no artist found
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            artists: {
              total: 0,
              items: [],
            },
          }),
      })
    );
  
    render(<App />);
  
    // Enter a non-existing artist and trigger search
    fireEvent.change(screen.getByPlaceholderText(/Preview a Music Artist/i), {
      target: { value: 'Unknown Artist' },
    });
    fireEvent.click(screen.getAllByText(/Search/i)[0]);
  
    // Wait for the specific error message to be displayed
    await waitFor(() => {
      const errorMessages = screen.getAllByText(/Artist not found!/i);
      // Check if one of the elements has the class 'error-message'
      expect(errorMessages.some(el => el.classList.contains('error-message'))).toBeTruthy();
    });
  });  

  test('allows user to login and fetches favorites', async () => {
    // Mocking the login and favorites fetch response
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              token: 'mocked_token',
              user: { id: 1, email: 'test@example.com' },
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                id: 'fav_track_id',
                track_name: 'Hello',
                artist_name: 'Adele',
                album_image: 'album_image_url',
              },
            ]),
        })
      );

    render(<App />);

    // Enter email and password for login
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText(/Login/i));

    // Wait for login and favorite tracks to appear
    await waitFor(() => expect(screen.getByText(/Welcome, test@example.com/i)).toBeInTheDocument());
    expect(screen.getByText(/Your Favorite Tracks/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello/i)).toBeInTheDocument(); // Favorite track
  });

  test('logs out user and clears favorites', async () => {
    // Mocking the login process first
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              token: 'mocked_token',
              user: { id: 1, email: 'test@example.com' },
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve([]), // Simulate fetching an empty favorites array
        })
      );

    render(<App />);

    // Enter email and password for login
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText(/Login/i));

    // Wait for login to be completed
    await waitFor(() => expect(screen.getByText(/Welcome, test@example.com/i)).toBeInTheDocument());

    // Now simulate the logout process
    fireEvent.click(screen.getByText(/Logout/i));

    // Wait for the logout to complete and check if the user info and favorites are cleared
    await waitFor(() => expect(screen.queryByText(/Welcome, test@example.com/i)).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Your Favorite Tracks/i)).not.toBeInTheDocument());
  });
});
