import React, { Component } from 'react';

class Search extends Component {
  state = {
    artistQuery: '', // Stores the artist query input by the user
    notificationMessage: '' // State to handle the notification message
  };

  // Handles changes in the search input field
  updateArtistQuery = (event) => {
    this.setState({ artistQuery: event.target.value.trim() });
  };

  // Handles the form submission when user presses Enter or clicks search
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
