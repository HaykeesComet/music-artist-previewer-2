const request = require('supertest');
const app = require('./app');
const pool = require('./db.js');
const jwt = require('jsonwebtoken');  // Import jwt

jest.mock('./db.js'); // Mock the db pool

// Create a function to generate a valid JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Favorites Controller', () => {
  beforeEach(() => {
    pool.query.mockImplementation((query, values) => {
      if (query.includes('DELETE FROM favorites')) {
        return Promise.resolve({
          rows: [{ track_id: 'track_123' }],
        });
      }

      if (query.includes('INSERT INTO favorites')) {
        return Promise.resolve({
          rows: [{ track_id: 'track_123', track_name: 'Test Song' }],
        });
      }

      if (query.includes('SELECT * FROM favorites WHERE user_id')) {
        return Promise.resolve({
          rows: [
            { track_id: 'track_123', track_name: 'Test Song', artist_name: 'Test Artist' },
          ],
        });
      }

      return Promise.resolve({ rows: [] });
    });
  });

  it('Add Favorite', async () => {
    const token = generateToken(1);  // Generate a valid token for user with id 1
    const res = await request(app)
      .post('/api/favorites')
      .send({
        userId: 1,
        trackId: 'track_123',
        trackName: 'Test Song',
        artistName: 'Test Artist',
        previewUrl: 'http://example.com/preview.mp3',
        albumImage: 'http://imageurl.com',
      })
      .set('Authorization', `Bearer ${token}`);  // Use the valid token

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('track_name', 'Test Song');
  });

  it('Get Favorites', async () => {
    const token = generateToken(1);  // Generate a valid token for user with id 1
    const res = await request(app)
      .get('/api/favorites') // No userId in the route
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Remove Favorite', async () => {
    const token = generateToken(1);  // Generate a valid token for user with id 1
    const res = await request(app)
      .delete('/api/favorites/1') // Assuming id of the favorite to remove
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('track_id');
  });
});
