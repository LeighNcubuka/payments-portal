// frontend/src/pages/CustomerRegister.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CustomerRegister() {
  const [form, setForm] = useState({ full_name: '', id_number: '', account_number: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', form);
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="page-header">
        <h2 className="page-title">International Payments Portal</h2>
      </div>
      <div className="container">
        <div className="card">
          <h2>Customer Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>
                  Full Name
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  ID Number (13 digits)
                  <input
                    type="text"
                    name="id_number"
                    placeholder="ID Number (13 digits)"
                    value={form.id_number}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Account Number (10 digits)
                  <input
                    type="text"
                    name="account_number"
                    placeholder="Account Number (10 digits)"
                    value={form.account_number}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegister;