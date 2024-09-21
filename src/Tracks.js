import React, { Component } from 'react';

class Tracks extends Component {
  state = { playing: false, audio: null, playingPreviewUrl: null };

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

  handleUnavailableTrack = () => {
    this.props.setNotificationMessage('Sorry, preview track is unavailable.');
  };

  trackIcon = (track) => {
    if (!track.preview_url) {
      return (
        <span onClick={this.handleUnavailableTrack} style={{ cursor: 'pointer' }}>
          🎵
        </span>
      );
    }

    if (this.state.playing && this.state.playingPreviewUrl === track.preview_url) {
      return <span>| |</span>;
    }

    return <span>&#9654;</span>;
  };

  render() {
    const { tracks, addFavorite } = this.props;

    if (tracks.length === 0) {
      return <p>No tracks available. Type an artist name to search.</p>;
    }

    return (
      <div>
        {tracks.map((track) => {
          const { id, name, album, preview_url } = track;

          return (
            <div key={id} className='track'>
              {album && album.images.length > 0 ? (
                <img src={album.images[0].url} alt='track-image' className='track-image' />
              ) : (
                <p>No Album Image Available</p>
              )}
              <p className='track-text'>{name}</p>
              <p className='track-icon' onClick={this.playAudio(preview_url)}>{this.trackIcon(track)}</p>

              {preview_url ? (
                <button onClick={() => addFavorite(track)}>
                  ✔️ <span className="add">add</span>
                </button>
              ) : (
                <p onClick={() => this.props.setNotificationMessage('Sorry, track is not playable and cannot be added to Favorites list.')}>
                  ⛓️‍💥
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
