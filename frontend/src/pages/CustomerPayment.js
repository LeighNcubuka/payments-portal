// frontend/src/pages/CustomerPayment.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CustomerPayment() {
  const [form, setForm] = useState({
    amount: '',
    currency: 'ZAR',
    provider: '',
    account_info: '',
    swift_code: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transactions', form, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      alert('Payment submitted successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <div className="page-header">
        <h2 className="page-title">International Payments Portal</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="container">
        <div className="card">
          <h2>Make a Payment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>
                  Amount
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Currency
                  <select name="currency" value={form.currency} onChange={handleChange}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="ZAR">ZAR</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Provider
                  <input
                    type="text"
                    name="provider"
                    placeholder="Provider"
                    value={form.provider}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Payee Account Info
                  <input
                    type="text"
                    name="account_info"
                    placeholder="Payee Account Info"
                    value={form.account_info}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  SWIFT Code
                  <input
                    type="text"
                    name="swift_code"
                    placeholder="SWIFT Code"
                    value={form.swift_code}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </div>
            <button type="submit">Pay Now</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerPayment;