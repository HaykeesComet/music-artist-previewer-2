# Hector Sevilla

## Capstone Two Project Proposal: Music Artist Previewer - Remind Me Quick Who Is?

### Project Overview

The Music Artist Previewer app is designed to help users search for music artists and quickly access information about their discography, including albums, release dates, and track previews. Users will also be able to save their favorite artists and tracks for easy access. The main objective of the app is to provide an intuitive and seamless interface for discovering and previewing artists' music in one place.

### Target Demographic

The target demographic for the Music Artist Previewer app includes:

- **Music Lovers:** Users who enjoy exploring new music and artists.
- **Collectors:** Users who want to keep track of their favorite artists and albums.
- **Curators:** Users who enjoy discovering new tracks and curating their personal music collection.

### Data Source

The app will pull data from a combination of an external API and a custom-built API:

- **External API:** The app will use the Spotify API to fetch artist information, albums, track listings, and previews.
- **Custom API:** A custom API will be developed to handle user authentication, favorite management, and other personalized features.

### Database Schema

The database schema will include the following key tables:

- **Users Table:** Stores user information, including email, password (hashed), and user profile details.
- **Favorites Table:** Tracks artists and tracks that users have saved to their favorites list, linking user IDs to artist or track IDs.

### Key Functionality

- **User Registration & Authentication:** Users will be able to create accounts, log in, and manage their profiles.
- **Artist Search:** Users can search for artists and view detailed information such as discography, tracks, and album previews.
- **Favorites Management:** Users can add and remove favorite artists or tracks from their profile.
- **Track Previews:** Users can listen to 30-second previews of tracks directly in the app.

### User Flow

1. **Landing Page:** Users are greeted with a search bar to explore their favorite music artists.
2. **Search & Discover:** Users search for artists, and the app fetches detailed artist information and tracks from the Spotify API.
3. **Artist Details:** Clicking on an artist displays their discography and top tracks, including track previews.
4. **Favorites Management:** Logged-in users can add and remove tracks and artists to/from their favorites list.
5. **Track Previews:** Users can listen to track previews and manage their favorites collection from the artist page.

### Potential Challenges

- **API Rate Limits:** Handling API rate limits from the Spotify API when fetching artist data.
- **Data Consistency:** Ensuring consistent data formatting between the external API and the custom database.
- **Performance Optimization:** Managing large amounts of data to ensure fast and seamless search functionality.

### Stretch Features

- **Playlist Creation:** Allow users to create playlists from their favorite tracks.
- **Easy Music Artist Search:** Yields desired artist results even with misspelled name searches.

### Timeline

- **Week 1:** Set up the project structure, integrate the Spotify API, and implement basic artist search and track display functionality.
- **Week 2:** Build user authentication and favorites management features.
- **Week 3:** Test and optimize the application, deploy it, and prepare for the project presentation.

### Conclusion

The Music Artist Previewer project offers an exciting opportunity to work with API integration, user authentication, and full-stack development. It provides a feature-rich music discovery platform that allows users to preview tracks and manage their favorite artists, making it a well-rounded and feasible capstone project.
