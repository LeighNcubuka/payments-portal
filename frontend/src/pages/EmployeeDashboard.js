// frontend/src/pages/EmployeeDashboard.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeDashboard() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: localStorage.getItem('employeeToken') },
        });
        setTransactions(res.data);
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to fetch transactions');
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      }
    };
    fetchTransactions();
  }, [navigate]);

  const handleVerify = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/transactions/${id}/verify`,
        {},
        { headers: { Authorization: localStorage.getItem('employeeToken') } }
      );
      setTransactions(transactions.filter((tx) => tx.id !== id));
      alert('Transaction verified');
    } catch (err) {
      alert(err.response?.data?.error || 'Verification failed');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('token'); // Clear both tokens to avoid confusion
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <div className="container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Employee Dashboard</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h3>Pending Transactions</h3>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>No pending transactions.</p>
          </div>
        ) : (
          <ul className="transaction-list">
            {transactions.map((tx) => (
              <li key={tx.id} className="transaction-item">
                <div className="transaction-details">
                  <div>
                    <span>Amount:</span>{' '}
                    <span className="value">{tx.amount} {tx.currency}</span>
                  </div>
                  <div>
                    <span>Provider:</span> <span className="value">{tx.provider}</span>
                  </div>
                  <div>
                    <span>SWIFT:</span> <span className="value">{tx.swift_code}</span>
                  </div>
                </div>
                <button className="verify-button" onClick={() => handleVerify(tx.id)}>
                  Verify
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;