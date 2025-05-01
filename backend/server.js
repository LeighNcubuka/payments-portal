const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key';
const saltRounds = 10;

// RegEx for whitelisting inputs
const nameRegex = /^[a-zA-Z\s]+$/;
const idNumberRegex = /^[0-9]{13}$/;
const accountNumberRegex = /^[0-9]{10}$/;
const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Customer Registration
app.post(
  '/api/register',
  [
    body('full_name').matches(nameRegex).withMessage('Invalid name'),
    body('id_number').matches(idNumberRegex).withMessage('Invalid ID number'),
    body('account_number').matches(accountNumberRegex).withMessage('Invalid account number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { full_name, id_number, account_number, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      db.run(
        'INSERT INTO customers (full_name, id_number, account_number, password) VALUES (?, ?, ?, ?)',
        [full_name, id_number, account_number, hashedPassword],
        function (err) {
          if (err) return res.status(400).json({ error: 'User already exists' });
          res.status(201).json({ message: 'Registration successful' });
        }
      );
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Customer Login
app.post('/api/login', async (req, res) => {
  const { account_number, password } = req.body;

  db.get('SELECT * FROM customers WHERE account_number = ?', [account_number], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, type: 'customer' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Employee Login
app.post('/api/employee/login', async (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM employees WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, type: 'employee' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Create Transaction (Customer)
app.post(
  '/api/transactions',
  authenticateToken,
  [
    body('amount').isFloat({ min: 0 }).withMessage('Invalid amount'),
    body('currency').isIn(['USD', 'EUR', 'ZAR']).withMessage('Invalid currency'),
    body('provider').notEmpty().withMessage('Provider is required'),
    body('account_info').notEmpty().withMessage('Account info is required'),
    body('swift_code').matches(swiftCodeRegex).withMessage('Invalid SWIFT code'),
  ],
  (req, res) => {
    if (req.user.type !== 'customer') return res.status(403).json({ error: 'Access denied' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { amount, currency, provider, account_info, swift_code } = req.body;
    db.run(
      'INSERT INTO transactions (customer_id, amount, currency, provider, account_info, swift_code) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, amount, currency, provider, account_info, swift_code],
      function (err) {
        if (err) return res.status(500).json({ error: 'Failed to create transaction' });
        res.status(201).json({ message: 'Transaction created' });
      }
    );
  }
);

// Get Transactions (Employee)
app.get('/api/transactions', authenticateToken, (req, res) => {
  if (req.user.type !== 'employee') return res.status(403).json({ error: 'Access denied' });

  db.all('SELECT * FROM transactions WHERE status = ?', ['pending'], (err, transactions) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch transactions' });
    res.json(transactions);
  });
});

// Verify Transaction (Employee)
app.post('/api/transactions/:id/verify', authenticateToken, (req, res) => {
  if (req.user.type !== 'employee') return res.status(403).json({ error: 'Access denied' });

  const { id } = req.params;
  db.run('UPDATE transactions SET status = ? WHERE id = ?', ['verified', id], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to verify transaction' });
    res.json({ message: 'Transaction verified' });
  });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));