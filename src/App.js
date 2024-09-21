import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import Search from './Search';
import Artist from './Artist';
import Tracks from './Tracks';
import { auth, db } from './firebase';
import About from './About';
import Contact from './Contact';

const API_ADDRESS = 'https://spotify-api-wrapper.appspot.com';

class App extends Component {
  state = {
    artist: null,
    tracks: [],
    errorMessage: '',
    user: null,
    favorites: [],
    email: '',
    password: '',
    isSigningUp: false, // To toggle between login and sign up
    playing: false,
    audio: null,
    playingPreviewUrl: null,
    currentPage: 1, // For pagination
    favoritesPerPage: 18, // Number of favorites per page
    notificationMessage: '', // New state for notifications
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user }, this.fetchFavorites);
      } else {
        this.setState({ user: null, favorites: [] });
      }
    });
  }

  fetchFavorites = async () => {
    const favoritesQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', this.state.user.uid)
    );
    const querySnapshot = await getDocs(favoritesQuery);
    const favorites = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
    this.setState({ favorites });
  };

  login = async () => {
    const { email, password, isSigningUp } = this.state;
  
    // Basic form validation
    if (!email || !password) {
      this.setState({ errorMessage: 'Email and password are required.' });
      return;
    }
  
    // Email format validation using regular expression
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      this.setState({ errorMessage: 'Please enter a valid email address.' });
      return;
    }
  
    // Password length validation
    if (password.length < 6) {
      this.setState({ errorMessage: 'Password must be at least 6 characters long.' });
      return;
    }
  
    try {
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      this.setState({ errorMessage: '' }); // Clear error message on success
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  };  

  logout = async () => {
    await signOut(auth);
  };

  addFavorite = async track => {
    if (!this.state.user) {
      this.setState({ notificationMessage: 'Please login to add favorites.' });
      return;
    }

    if (this.state.favorites.some(fav => fav.trackId === track.id)) {
      this.setState({ notificationMessage: 'Track already in favorites.' });
      return;
    }

    try {
      await addDoc(collection(db, 'favorites'), {
        userId: this.state.user.uid,
        trackId: track.id,
        trackName: track.name,
        artistName: this.state.artist.name,
        previewUrl: track.preview_url,
        albumImage: track.album.images[0]?.url,
      });
      this.setState({ notificationMessage: 'Track added to favorites!' });
      this.fetchFavorites();
    } catch (error) {
      console.error('Error adding favorite: ', error);
    }
  };

  removeFavorite = async docId => {
    try {
      await deleteDoc(doc(db, 'favorites', docId));
      this.setState({ notificationMessage: 'Track removed from favorites!' });
      this.fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite: ', error);
    }
  };

  searchArtist = artistQuery => {
    if (!artistQuery) {
      this.setState({ errorMessage: 'Please enter a valid artist name.' });
      return;
    }

    fetch(`${API_ADDRESS}/artist/${artistQuery}`)
      .then(response => response.json())
      .then(json => {
        if (json.artists.total > 0) {
          const artist = json.artists.items[0];
          this.setState({ artist, errorMessage: '' });

          fetch(`${API_ADDRESS}/artist/${artist.id}/top-tracks`)
            .then(response => response.json())
            .then(json => this.setState({ tracks: json.tracks }))
            .catch(error =>
              this.setState({ errorMessage: 'Failed to fetch tracks.' })
            );
        } else {
          this.setState({ errorMessage: 'Artist not found!' });
        }
      })
      .catch(error =>
        this.setState({ errorMessage: 'Failed to fetch artist data.' })
      );
  };

  playAudio = (previewUrl) => () => {
    if (!previewUrl) return;

    const audio = new Audio(previewUrl);

    if (!this.state.playing) {
      audio.play();
      this.setState({ playing: true, audio, playingPreviewUrl: previewUrl });
    } else {
      this.state.audio.pause();

      if (this.state.playingPreviewUrl === previewUrl) {
        this.setState({ playing: false });
      } else {
        audio.play();
        this.setState({ audio, playingPreviewUrl: previewUrl });
      }
    }
  };

  trackIcon = (track) => {
    if (!track.preview_url) {
      return <span>||▷</span>;
    }

    if (this.state.playing && this.state.playingPreviewUrl === track.preview_url) {
      return <span>| |</span>;
    }

    return <span>&#9654;</span>;
  };

  // Function to handle page change
  handlePageChange = (direction) => {
    const { currentPage, favorites, favoritesPerPage } = this.state;
    const totalPages = Math.ceil(favorites.length / favoritesPerPage);

    if (direction === 'next' && currentPage < totalPages) {
      this.setState({ currentPage: currentPage + 1 });
    } else if (direction === 'prev' && currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  render() {
    const { isSigningUp, email, password, favorites, currentPage, favoritesPerPage } = this.state;
  
    // Logic for displaying current favorites page
    const indexOfLastFavorite = currentPage * favoritesPerPage;
    const indexOfFirstFavorite = indexOfLastFavorite - favoritesPerPage;
    const currentFavorites = favorites.slice(indexOfFirstFavorite, indexOfLastFavorite);
    const totalPages = Math.ceil(favorites.length / favoritesPerPage);
  
    return (
      <Router>
        <div>
          {/* Add the text logo outside the navbar */}
          <div className="logo-container logo">
            Music Artist Previewer
          </div>
  
          {/* Navigation Bar */}
          <nav className="navbar">
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>

          {/* Routing */}
          <Routes>
            {/* Home Page */}
            <Route path="/" element={
              <div>
                <h1>Remind Me Quick Who Is?</h1>
                {/* Search Component */}
                <Search searchArtist={this.searchArtist} />
                {/* User login/signup */}
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
                      onChange={e => this.setState({ email: e.target.value })}
                    />
                    <input
                      type="password"
                      value={password}
                      placeholder="Password"
                      onChange={e => this.setState({ password: e.target.value })}
                    />
                    <button onClick={this.login}>
                      {isSigningUp ? 'Sign Up' : 'Login'}
                    </button>
                    <button
                      onClick={() => this.setState({ isSigningUp: !this.state.isSigningUp })}
                    >
                      {isSigningUp ? 'Switch to Login' : 'Switch to Sign Up'}
                    </button>

                    {/* Display the validation error message */}
                    {this.state.errorMessage && (
                      <p className="error-message">{this.state.errorMessage}</p>
                    )}
                  </div>
                )}
                {/* Artist and Tracks Components */}
                <Artist artist={this.state.artist} />
                <Tracks
                  tracks={this.state.tracks}
                  addFavorite={this.addFavorite}
                  playAudio={this.playAudio}
                  trackIcon={this.trackIcon}
                  setNotificationMessage={(message) => this.setState({ notificationMessage: message })}
                />
                {/* Display notification message if exists */}
                {this.state.notificationMessage && (
                  <p className="notification-message">{this.state.notificationMessage}</p>
                )}
                {/* Favorite Tracks with Pagination */}
                <h3>Your Favorite Tracks:</h3>
                <div className="favorites-container">
                  {currentFavorites.map((fav, idx) => (
                    <div key={idx} className='track'>
                      <img
                        src={fav.albumImage}
                        alt="track-image"
                        className="favorite-track-image"
                      />
                      <p className="track-text">{fav.trackName} - {fav.artistName}</p>
                      <p className="track-icon" onClick={this.playAudio(fav.previewUrl)}>
                        {this.trackIcon(fav)}
                      </p>
                      <button onClick={() => this.removeFavorite(fav.docId)}>
                        ✖️ <span className="remove">remove</span>
                      </button>
                    </div>
                  ))}
                </div>
  
                {/* Pagination Buttons */}
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
            } />
  
            {/* About and Contact Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
