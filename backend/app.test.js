const request = require('supertest');
const app = require('./app');  // Adjust path if needed
const pool = require('./db.js');

describe('App and Routes', () => {

  // Test database connection
  it('should successfully connect to the database', async () => {
    const res = await pool.query('SELECT NOW()');
    expect(res.rows.length).toBe(1);
  });

  // Test the base route of the auth
  it('should return 404 for undefined routes', async () => {
    const res = await request(app).get('/undefined-route');
    expect(res.statusCode).toEqual(404);
  });

});
