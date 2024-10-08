import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Search from './Search';

describe('Search Component', () => {
  test('renders search input and button', () => {
    render(<Search searchArtist={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Preview a Music Artist/i)).toBeInTheDocument();
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
  });

  test('calls searchArtist prop function when searching', async () => {
    const searchArtistMock = jest.fn().mockResolvedValue(); // Mock to return a resolved Promise

    render(<Search searchArtist={searchArtistMock} />);

    fireEvent.change(screen.getByPlaceholderText(/Preview a Music Artist/i), {
      target: { value: 'Adele' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/Search/i));
    });

    expect(searchArtistMock).toHaveBeenCalledWith('Adele');
  });

  test('displays notification when input is empty', () => {
    render(<Search searchArtist={jest.fn()} />);
    fireEvent.click(screen.getByText(/Search/i));
    expect(screen.getByText(/Please type in a Music Artist to preview/i)).toBeInTheDocument();
  });
});
