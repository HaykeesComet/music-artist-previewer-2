import React, { Component } from 'react';

// Search component that handles artist query and search submission
class Search extends Component {
  state = {
    artistQuery: '', // Store user input for the artist search
    notificationMessage: '', // Store messages for user notifications
    isLoading: false // Track whether the search is currently loading
  };

  // Update the artist query as the user types
  updateArtistQuery = (event) => {
    this.setState({ artistQuery: event.target.value.trim() });
  };

  // Trigger search on pressing Enter
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.searchArtist(); // Call search when the user presses Enter
    }
  };

  // Handle search for the artist when the user clicks the search button
  searchArtist = () => {
    const { artistQuery } = this.state; // Get the current artist query from state

    if (artistQuery === '') {
      // If the query is empty, notify the user
      this.setState({ notificationMessage: 'Please type in a Music Artist to preview' });
    } else {
      this.setState({ notificationMessage: '', isLoading: true }); // Clear notifications and set loading to true
      this.props.searchArtist(artistQuery).finally(() => {
        this.setState({ isLoading: false }); // Set loading to false when search is done
      });
    }
  };

  render() {
    const { isLoading } = this.state; // Destructure loading state

    return (
      <div>
        {/* Input field for entering artist name */}
        <input
          onChange={this.updateArtistQuery} // Update artist query on input change
          onKeyPress={this.handleKeyPress} // Search on Enter key press
          placeholder='Preview a Music Artist'
        />
        {/* Search button, disabled while loading */}
        <button onClick={this.searchArtist} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'} {/* Show different text when loading */}
        </button>

        {/* Display notification message if any */}
        {this.state.notificationMessage && (
          <p className="notification-message">{this.state.notificationMessage}</p>
        )}
      </div>
    );
  }
}

export default Search;
