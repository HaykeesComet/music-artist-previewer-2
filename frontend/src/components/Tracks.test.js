import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tracks from './Tracks';

describe('Tracks Component', () => {
  const track = {
    id: 'track_id',
    name: 'Hello',
    preview_url: 'preview_url',
    album: { images: [{ url: 'album_image_url' }] },
  };

  test('renders track information', () => {
    render(
      <Tracks
        tracks={[track]}
        addFavorite={jest.fn()}
        setNotificationMessage={jest.fn()}
        favorites={[]} // Ensure favorites is passed
        toggleFavorite={jest.fn()} // Pass toggleFavorite mock
      />
    );

    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    expect(screen.getByAltText(/track-image/i)).toBeInTheDocument();
  });

  test('calls addFavorite when add button is clicked', () => {
    const toggleFavoriteMock = jest.fn();
    render(
      <Tracks
        tracks={[track]}
        addFavorite={jest.fn()}
        setNotificationMessage={jest.fn()}
        favorites={[]} // Ensure favorites is passed
        toggleFavorite={toggleFavoriteMock} // Pass toggleFavorite mock
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(toggleFavoriteMock).toHaveBeenCalledWith(track);
  });

  test('handles unavailable tracks', () => {
    const trackWithoutPreview = { ...track, preview_url: null };
    const setNotificationMessageMock = jest.fn();

    render(
      <Tracks
        tracks={[trackWithoutPreview]}
        addFavorite={jest.fn()}
        setNotificationMessage={setNotificationMessageMock}
        favorites={[]} // Pass favorites as an empty array
        toggleFavorite={jest.fn()} // Pass toggleFavorite mock
      />
    );

    fireEvent.click(screen.getByText(/⛓️‍💥/i));
    expect(setNotificationMessageMock).toHaveBeenCalledWith(
      'Sorry, track is not playable and cannot be added to Favorites list.'
    );
  });
});
