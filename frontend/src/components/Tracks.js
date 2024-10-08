import React, { Component } from 'react';

// Tracks component to display artist's top tracks and allow adding/removing favorites
class Tracks extends Component {
  static defaultProps = {
    favorites: [], // Default favorites to an empty array to avoid errors if no favorites are passed
  };

  state = {
    playing: false, // Track whether a song is currently playing
    audio: null, // Store the audio object for previewing tracks
    playingPreviewUrl: null, // Store the URL of the currently playing preview
  };

  // Handle playing and pausing audio for a track
  playAudio = (previewUrl) => () => {
    if (!previewUrl) return; // Do nothing if no preview URL is available

    const audio = new Audio(previewUrl); // Create a new audio object

    if (!this.state.playing) {
      audio.play(); // Play the audio if no track is currently playing
      this.setState({ playing: true, audio, playingPreviewUrl: previewUrl });
    } else {
      this.state.audio.pause(); // Pause the currently playing track

      if (this.state.playingPreviewUrl === previewUrl) {
        this.setState({ playing: false }); // Stop playing if the same track is clicked again
      } else {
        audio.play(); // Play the new track
        this.setState({ audio, playingPreviewUrl: previewUrl });
      }
    }
  };

  // Notify the user if a track is unavailable for preview
  handleUnavailableTrack = () => {
    this.props.setNotificationMessage('Sorry, preview track is unavailable.');
  };

  // Display the appropriate play/pause icon for each track
  trackIcon = (track) => {
    if (!track.preview_url) {
      return (
        <span onClick={this.handleUnavailableTrack} style={{ cursor: 'pointer' }}>
          🎵 {/* Show a note icon if no preview is available */}
        </span>
      );
    }

    if (this.state.playing && this.state.playingPreviewUrl === track.preview_url) {
      return <span>| |</span>; // Show pause icon if the track is playing
    }

    return <span>&#9654;</span>; // Show play icon if the track is not playing
  };

  render() {
    const { tracks, favorites, toggleFavorite } = this.props; // Destructure props passed from parent

    // Show a message if no tracks are available
    if (tracks.length === 0) {
      return <p>No tracks available. Type an artist name to search.</p>;
    }

    return (
      <div>
        {/* Map through tracks and display each one */}
        {tracks.map((track) => {
          const { id, name, album, preview_url } = track; // Destructure track details
          const isFavorite = favorites.some(fav => fav.track_id === id); // Check if the track is already a favorite

          return (
            <div key={id} className='track'>
              {/* Display album image if available, otherwise show a message */}
              {album && album.images.length > 0 ? (
                <img src={album.images[0].url} alt='track-image' className='track-image' />
              ) : (
                <p>No Album Image Available</p>
              )}
              <p className='track-text'>{name}</p> {/* Display track name */}
              <p className='track-icon' onClick={this.playAudio(preview_url)}>{this.trackIcon(track)}</p> {/* Play/pause icon */}

              {/* Add/remove favorite button */}
              {preview_url ? (
                <button onClick={() => toggleFavorite(track)}>
                  {isFavorite ? '✖️ Remove' : '✔️ Add'} {/* Toggle button text based on favorite status */}
                </button>
              ) : (
                <p onClick={() => this.props.setNotificationMessage('Sorry, track is not playable and cannot be added to Favorites list.')}>
                  ⛓️‍💥 {/* Display this if the track is not playable */}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Tracks;
