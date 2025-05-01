// frontend/src/pages/CustomerLogin.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({
    account_number: '',
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (role === 'customer') {
        res = await axios.post('http://localhost:5000/api/login', {
          account_number: form.account_number,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        navigate('/payment');
      } else {
        res = await axios.post('http://localhost:5000/api/employee/login', {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem('employeeToken', res.data.token);
        navigate('/employee/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="page-header">
        <h2 className="page-title">International Payments Portal</h2>
      </div>
      <div className="container">
        <div className="card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>
                  Login as:
                  <select value={role} onChange={handleRoleChange}>
                    <option value="customer">Customer</option>
                    <option value="employee">Employee</option>
                  </select>
                </label>
              </div>
              {role === 'customer' ? (
                <div>
                  <label>
                    Account Number
                    <input
                      type="text"
                      name="account_number"
                      placeholder="Account Number"
                      value={form.account_number}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <label>
                    Username
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              )}
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
            <button type="submit">Login</button>
          </form>
          {role === 'customer' && (
            <p className="text-secondary">
              Don't have an account? <a href="/register">Register here</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;