const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('./app');
const pool = require('./db.js');

describe('Auth Controller', () => {

  afterAll(() => {
    pool.end();  // Ensure the pool is closed after tests
  });

  beforeEach(async () => {
    // Clear all favorites and users and reset the id sequence
    await pool.query('DELETE FROM favorites');
    await pool.query('DELETE FROM users');
    await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');  // Reset id sequence
  });

  // Test signup
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'newuser@example.com',
        password: 'newpassword'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });

  // Test login
  it('should log in an existing user', async () => {
    // Insert a user directly into the database
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query(`
      INSERT INTO users (email, password) VALUES
      ('user1@example.com', $1);
    `, [hashedPassword]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user1@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });

  // Test login with invalid credentials
  it('should return 401 for invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wronguser@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
