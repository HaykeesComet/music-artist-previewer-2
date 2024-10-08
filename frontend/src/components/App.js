import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // React Router for routing
import Search from './Search'; // Search component for artist search functionality
import Artist from './Artist'; // Artist component to display artist details
import Tracks from './Tracks'; // Tracks component to display artist's top tracks
import About from './About'; // About page
import Contact from './Contact'; // Contact page

const API_ADDRESS = 'https://spotify-api-wrapper.appspot.com'; // API address for fetching artist data
const API_BASE_URL = 'http://localhost:5000'; // Backend API for authentication and favorites

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null, // Stores artist data after search
      tracks: [], // Stores tracks for the artist
      errorMessage: '', // Error message for user feedback
      user: null, // Stores user data after login/signup
      favorites: [], // Stores user's favorite tracks
      email: '', // Stores user email input for login/signup
      password: '', // Stores user password input for login/signup
      isSigningUp: false, // Toggle between login and signup mode
      playing: false, // Track whether a song is currently playing
      audio: null, // Stores audio object for previewing tracks
      playingPreviewUrl: null, // Stores the currently playing preview URL
      currentPage: 1, // Current page for pagination of favorites
      favoritesPerPage: 18, // Number of favorites per page
      totalPages: 1, // Total number of pages for pagination
      notificationMessage: '', // Notification message for user actions (e.g., adding/removing favorites)
    };

    this.handlePageChange = this.handlePageChange.bind(this); // Bind the pagination handler
  }

  // Component lifecycle method to check if the user is logged in and fetch their favorites
  componentDidMount() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.setState({ user: JSON.parse(user) }); // Set user data from localStorage
      this.fetchFavorites(token); // Fetch user's favorite tracks from the backend
    }
  }

  // Fetch the logged-in user's data from the backend
  fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` }, // Include JWT token in request headers
      });
      const user = await response.json();
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', JSON.stringify(user)); // Save user data in localStorage
      }
    } catch (error) {
      console.error('Error fetching user:', error); // Log error if the request fails
    }
  };

  // Handle user login or signup
  login = async () => {
    const { email, password, isSigningUp } = this.state;

    if (!email || !password) {
      this.setState({ errorMessage: 'Email and password are required.' });
      return;
    }

    try {
      const endpoint = isSigningUp
        ? `${API_BASE_URL}/api/auth/signup` // Endpoint for signup
        : `${API_BASE_URL}/api/auth/login`; // Endpoint for login

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Send email and password in request body
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token); // Store JWT token in localStorage
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user data in localStorage
        this.setState({ user: data.user, errorMessage: '' });
        this.fetchFavorites(data.token); // Fetch user's favorite tracks
      } else {
        this.setState({ errorMessage: data.message });
      }
    } catch (error) {
      console.error('Error logging in:', error); // Log error if login fails
      this.setState({ errorMessage: 'Error logging in. Please try again.' });
    }
  };

  // Handle user logout
  logout = () => {
    localStorage.removeItem('token'); // Remove JWT token from localStorage
    localStorage.removeItem('user'); // Remove user data from localStorage
    this.setState({ user: null, favorites: [] }); // Reset user and favorites state
  };

  // Fetch the user's favorite tracks from the backend
  fetchFavorites = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` }, // Include JWT token in request headers
      });
      const favorites = await response.json();
      const totalPages = Math.ceil(favorites.length / this.state.favoritesPerPage); // Calculate total pages for pagination
      this.setState({ favorites, totalPages });
    } catch (error) {
      console.error('Error fetching favorites:', error); // Log error if the request fails
    }
  };

  // Toggle favorite (add/remove) for a track
  toggleFavorite = async (track) => {
    if (!this.state.user) {
      this.setState({ notificationMessage: 'Please login to add favorites.' });
      return;
    }

    const existingFavorite = this.state.favorites.find(fav => fav.track_id === track.id); // Check if track is already in favorites

    if (existingFavorite) {
      this.removeFavorite(existingFavorite.id); // Remove favorite if it exists
    } else {
      this.addFavorite(track); // Add favorite if it doesn't exist
    }
  };

  // Add a track to the user's favorites
  addFavorite = async (track) => {
    const token = localStorage.getItem('token'); // Get JWT token from localStorage
    const { artist } = this.state;

    try {
      const response = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include JWT token in request headers
        },
        body: JSON.stringify({
          trackId: track.id,
          trackName: track.name,
          artistName: artist.name,
          previewUrl: track.preview_url,
          albumImage: track.album.images[0]?.url,
        }), // Send track data in request body
      });
      const favorite = await response.json();
      this.setState({
        favorites: [...this.state.favorites, favorite], // Add favorite to the state
        notificationMessage: 'Track added to favorites!',
      });
    } catch (error) {
      console.error('Error adding favorite:', error); // Log error if the request fails
      this.setState({ notificationMessage: 'Error adding favorite track.' });
    }
  };

  // Remove a track from the user's favorites
  removeFavorite = async (favoriteId) => {
    const token = localStorage.getItem('token'); // Get JWT token from localStorage

    try {
      await fetch(`${API_BASE_URL}/api/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }, // Include JWT token in request headers
      });
      const updatedFavorites = this.state.favorites.filter((fav) => fav.id !== favoriteId); // Filter out the removed favorite
      this.setState({
        favorites: updatedFavorites, // Update favorites state
        notificationMessage: 'Track removed from favorites!',
      });
    } catch (error) {
      console.error('Error removing favorite:', error); // Log error if the request fails
      this.setState({ notificationMessage: 'Error removing favorite track.' });
    }
  };

  // Search for an artist using the Spotify API
  searchArtist = (artistQuery) => {
    return new Promise((resolve, reject) => {
      if (!artistQuery) {
        this.setState({ errorMessage: 'Please enter a valid artist name.' });
        reject('Artist query is empty');
        return;
      }

      fetch(`${API_ADDRESS}/artist/${artistQuery}`)
        .then((response) => response.json())
        .then((json) => {
          if (json.artists.total > 0) {
            const artist = json.artists.items[0];
            this.setState({ artist, errorMessage: '' });

            // Fetch the artist's top tracks
            fetch(`${API_ADDRESS}/artist/${artist.id}/top-tracks`)
              .then((response) => response.json())
              .then((json) => {
                this.setState({ tracks: json.tracks });
                resolve();
              })
              .catch((error) => {
                this.setState({ errorMessage: 'Failed to fetch tracks.' });
                reject(error);
              });
          } else {
            this.setState({ errorMessage: 'Artist not found!' });
            resolve(); // Ensure resolve is called even if no artist is found
          }
        })
        .catch((error) => {
          this.setState({ errorMessage: 'Failed to fetch artist data.' });
          reject(error);
        });
    });
  };

  // Play a preview of the selected track
  playAudio = (previewUrl) => () => {
    if (!previewUrl) return;

    const audio = new Audio(previewUrl); // Create a new audio object

    if (!this.state.playing) {
      audio.play(); // Play the track
      this.setState({ playing: true, audio, playingPreviewUrl: previewUrl });
    } else {
      this.state.audio.pause(); // Pause the currently playing track

      if (this.state.playingPreviewUrl === previewUrl) {
        this.setState({ playing: false }); // Stop playing if the same track is clicked
      } else {
        audio.play(); // Play the new track
        this.setState({ audio, playingPreviewUrl: previewUrl });
      }
    }
  };

  // Display the appropriate icon for track preview (play/pause)
  trackIcon = (track) => {
    if (!track.preview_url) {
      return (
        <span onClick={this.handleUnavailableTrack} style={{ cursor: 'pointer' }}>
          🎵
        </span>
      );
    }

    if (this.state.playing && this.state.playingPreviewUrl === track.preview_url) {
      return <span>| |</span>; // Display pause icon when the track is playing
    }

    return <span>&#9654;</span>; // Display play icon when the track is not playing
  };

  // Handle pagination of favorites
  handlePageChange = (direction) => {
    const { currentPage, totalPages } = this.state;

    let newPage = currentPage;

    if (direction === 'next' && currentPage < totalPages) {
      newPage = currentPage + 1; // Go to the next page
    } else if (direction === 'prev' && currentPage > 1) {
      newPage = currentPage - 1; // Go to the previous page
    }

    this.setState({ currentPage: newPage });
  };

  render() {
    const {
      isSigningUp, // Track whether the user is in signup mode
      email, // Store email input
      password, // Store password input
      favorites, // Store user's favorite tracks
      currentPage, // Store the current page for pagination
      favoritesPerPage, // Number of favorites per page
      notificationMessage, // Store notification messages (e.g., "Track added to favorites")
      artist, // Store the selected artist
      tracks, // Store the artist's top tracks
      errorMessage, // Store error messages (e.g., "Artist not found")
    } = this.state;

    const indexOfLastFavorite = currentPage * favoritesPerPage; // Calculate the index of the last favorite on the current page
    const indexOfFirstFavorite = indexOfLastFavorite - favoritesPerPage; // Calculate the index of the first favorite on the current page
    const currentFavorites = favorites.slice(indexOfFirstFavorite, indexOfLastFavorite); // Slice the favorites array to get the favorites for the current page
    const totalPages = Math.ceil(favorites.length / favoritesPerPage); // Calculate the total number of pages

    return (
      <Router>
        <div>
          <div className="logo-container logo">Music Artist Previewer</div>

          {/* Navigation bar */}
          <nav className="navbar">
            <ul className="nav-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          {/* Define routes for different pages */}
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1>Remind Me Quick Who Is?</h1>
                  <Search searchArtist={this.searchArtist} />
                  {errorMessage && <p>{errorMessage}</p>}
                  {this.state.user ? (
                    <div>
                      <p>Welcome, {this.state.user.email}</p>
                      <button onClick={this.logout}>Logout</button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => this.setState({ email: e.target.value })}
                      />
                      <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => this.setState({ password: e.target.value })}
                      />
                      <button onClick={this.login}>
                        {isSigningUp ? 'Sign Up' : 'Login'}
                      </button>
                      <button onClick={() => this.setState({ isSigningUp: !this.state.isSigningUp })}>
                        {isSigningUp ? 'Switch to Login' : 'Switch to Sign Up'}
                      </button>
                      {this.state.errorMessage && (
                        <p className="error-message">{this.state.errorMessage}</p>
                      )}
                    </div>
                  )}
                  <Artist artist={artist} />
                  {notificationMessage && (
                    <p className="notification-message">{notificationMessage}</p>
                  )}

                  <Tracks
                    tracks={tracks}
                    favorites={this.state.favorites}
                    toggleFavorite={this.toggleFavorite}
                    playAudio={this.playAudio}
                    setNotificationMessage={(message) =>
                      this.setState({ notificationMessage: message })
                    }
                  />

                  {/* Display user's favorite tracks */}
                  {favorites.length > 0 && (
                    <>
                      <h3>Your Favorite Tracks:</h3>
                      <div className="favorites-container">
                        {currentFavorites.map((fav, idx) => (
                          <div key={idx} className="track">
                            <img
                              src={fav.album_image}
                              alt="track-image"
                              className="favorite-track-image"
                            />
                            <p className="track-text">
                              {fav.track_name} - {fav.artist_name}
                            </p>
                            <p className="track-icon" onClick={this.playAudio(fav.preview_url)}>
                              {this.trackIcon(fav)}
                            </p>
                            <button onClick={() => this.removeFavorite(fav.id)}>
                              ✖️ <span className="remove">remove</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Pagination for the favorites list */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => this.handlePageChange('prev')}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span>{`Page ${currentPage} of ${totalPages}`}</span>
                      <button
                        onClick={() => this.handlePageChange('next')}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              }
            />

            {/* Define routes for the About and Contact pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
