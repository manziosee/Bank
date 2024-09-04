// __tests__/externalTransfer.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Account = require('../models/Account');
const axios = require('axios');

jest.mock('axios');

describe('External Bank Transfers', () => {
  let token;
  let account;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = new User({ name: 'Jane Doe', email: 'jane@example.com', password: '123456' });
    await user.save();

    token = (await request(app).post('/api/auth/login').send({ email: 'jane@example.com', password: '123456' })).body.token;
    account = await Account.create({ user: user._id, accountNumber: 'ACC123', balance: 100 });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Account.deleteMany({});
  });

  test('POST /api/transactions/deposit-from-bank - should deposit money from an external bank', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    const res = await request(app)
      .post('/api/transactions/deposit-from-bank')
      .set('Authorization', `Bearer ${token}`)
      .send({ accountNumber: account.accountNumber, amount: 50 });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(50);
  });

  test('POST /api/transactions/withdraw-to-bank - should withdraw money to an external bank', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    const res = await request(app)
      .post('/api/transactions/withdraw-to-bank')
      .set('Authorization', `Bearer ${token}`)
      .send({ accountNumber: account.accountNumber, amount: 50 });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(50);
  });
});
