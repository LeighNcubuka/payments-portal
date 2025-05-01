// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('payments.db'); 

db.serialize(() => {
  // Customers table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      id_number TEXT NOT NULL UNIQUE,
      account_number TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // Employees table (pre-registered)
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // Transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      provider TEXT NOT NULL,
      account_info TEXT NOT NULL,
      swift_code TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);

  // Pre-register  employees
  const bcrypt = require('bcrypt');
  const saltRounds = 10;

  const employees = [
    { username: 'employee1', password: 'emp123' },
    { username: 'employee2', password: 'emp456' },
    { username: 'employee3', password: 'emp789' },
  ];

  employees.forEach(({ username, password }) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error(`Error hashing password for ${username}:`, err);
        return;
      }
      db.run(
        'INSERT OR IGNORE INTO employees (username, password) VALUES (?, ?)',
        [username, hash],
        (err) => {
          if (err) {
            console.error(`Error inserting employee ${username}:`, err);
          } else {
            console.log(`Employee ${username} inserted successfully`);
          }
        }
      );
    });
  });
});

module.exports = db;