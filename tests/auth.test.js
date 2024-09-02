// __tests__/auth.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - should authenticate user and return a token', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    await user.save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: '123456',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - should fail with incorrect password', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    await user.save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});
