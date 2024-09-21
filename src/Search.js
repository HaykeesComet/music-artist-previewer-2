import React, { Component } from 'react';

class Search extends Component {
  state = {
    artistQuery: '',
    notificationMessage: '' // State to handle the notification message
  };

  updateArtistQuery = (event) => {
    this.setState({ artistQuery: event.target.value.trim() });
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.searchArtist();
    }
  };

  searchArtist = () => {
    const { artistQuery } = this.state;

    if (artistQuery === '') {
      // Show the notification message if input is empty
      this.setState({ notificationMessage: 'Please type in a Music Artist to preview' });
    } else {
      // Clear the notification message when input is valid and call the search function
      this.setState({ notificationMessage: '' });
      this.props.searchArtist(artistQuery);
    }
  };

  render() {
    return (
      <div>
        <input
          onChange={this.updateArtistQuery}
          onKeyPress={this.handleKeyPress}
          placeholder='Preview a Music Artist'
        />
        <button onClick={this.searchArtist}>Search</button>

        {/* Display notification message if it exists */}
        {this.state.notificationMessage && (
          <p className="notification-message">{this.state.notificationMessage}</p>
        )}
      </div>
    );
  }
}

export default Search;
