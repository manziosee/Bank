// __tests__/transaction.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

describe('Transaction API', () => {
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
    await Transaction.deleteMany({});
  });

  test('POST /api/transactions/deposit - should deposit money into an account', async () => {
    const res = await request(app)
      .post('/api/transactions/deposit')
      .set('Authorization', `Bearer ${token}`)
      .send({ accountNumber: account.accountNumber, amount: 50 });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(50);
  });

  test('POST /api/transactions/withdraw - should withdraw money from an account', async () => {
    const res = await request(app)
      .post('/api/transactions/withdraw')
      .set('Authorization', `Bearer ${token}`)
      .send({ accountNumber: account.accountNumber, amount: 50 });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(50);
  });

  test('POST /api/transactions/transfer - should transfer money between accounts', async () => {
    const toAccount = await Account.create({ user: mongoose.Types.ObjectId(), accountNumber: 'ACC456', balance: 100 });

    const res = await request(app)
      .post('/api/transactions/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({ fromAccountNumber: account.accountNumber, toAccountNumber: toAccount.accountNumber, amount: 50 });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(50);
  });

  test('GET /api/transactions - should get all transactions for the user', async () => {
    await Transaction.create({ fromAccount: account._id, toAccount: mongoose.Types.ObjectId(), amount: 50, type: 'transfer' });

    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
