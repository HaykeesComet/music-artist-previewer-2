import React from 'react';

// Functional component to display artist details
const Artist = ({ artist }) => {
  if (!artist) return null; // If no artist data is available, return nothing (null)

  const { images, name, followers, genres } = artist; // Destructure relevant artist details

  return (
    <div>
      <h2>{name}</h2> {/* Display artist name */}
      <p>{followers.total.toLocaleString()} followers</p> {/* Display follower count formatted with commas */}
      <p>{genres.join(', ')}</p> {/* Display genres as a comma-separated list */}
      {images.length > 0 ? ( // Check if the artist has an image available
        <img
          src={images[0].url} // Use the first available image URL
          alt='artist-profile' // Alt text for the image
          style={{
            width: 200, // Set width for the image
            height: 200, // Set height for the image
            borderRadius: 100, // Make the image circular
            objectFit: 'cover', // Ensure the image is properly contained within the dimensions
          }}
        />
      ) : (
        <p>No Image Available</p> // If no image is available, display this message
      )}
    </div>
  );
};

export default Artist;
