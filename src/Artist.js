import React from 'react';

const Artist = ({ artist }) => {
  if (!artist) return null; // If no artist is available, return nothing

  const { images, name, followers, genres } = artist; // Destructures the artist object

  return (
    <div>
      <h2>{name}</h2>
      <p>{followers.total.toLocaleString()} followers</p>
      <p>{genres.join(', ')}</p>
      {images.length > 0 ? (
        <img
          src={images[0].url}
          alt='artist-profile'
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            objectFit: 'cover',
          }}
        />
      ) : (
        <p>No Image Available</p>
      )}
    </div>
  );
};

export default Artist;
