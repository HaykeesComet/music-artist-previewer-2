// Artist.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Artist from './Artist';

describe('Artist Component', () => {
  test('renders artist information', () => {
    const artist = {
      images: [{ url: 'image_url' }],
      name: 'Adele',
      followers: { total: 1000000 },
      genres: ['pop', 'soul'],
    };

    render(<Artist artist={artist} />);

    expect(screen.getByText(/Adele/i)).toBeInTheDocument();
    expect(screen.getByText(/1,000,000 followers/i)).toBeInTheDocument();
    expect(screen.getByText(/pop, soul/i)).toBeInTheDocument();
    expect(screen.getByAltText(/artist-profile/i)).toBeInTheDocument();
  });

  test('renders no image available when images are empty', () => {
    const artist = {
      images: [],
      name: 'Unknown Artist',
      followers: { total: 0 },
      genres: [],
    };

    render(<Artist artist={artist} />);

    expect(screen.getByText(/No Image Available/i)).toBeInTheDocument();
  });
});
