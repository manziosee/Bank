// __tests__/account.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Account = require('../models/Account');

describe('Account API', () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = new User({ name: 'Jane Doe', email: 'jane@example.com', password: '123456' });
    await user.save();

    token = (await request(app).post('/api/auth/login').send({ email: 'jane@example.com', password: '123456' })).body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Account.deleteMany({});
  });

  test('POST /api/accounts - should create a new account', async () => {
    const res = await request(app)
      .post('/api/accounts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('accountNumber');
  });

  test('GET /api/accounts - should get all accounts for the user', async () => {
    await Account.create({ user: mongoose.Types.ObjectId(), accountNumber: 'ACC123', balance: 100 });

    const res = await request(app)
      .get('/api/accounts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
