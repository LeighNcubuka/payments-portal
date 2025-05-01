// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerRegister from './pages/CustomerRegister';
import Login from './pages/CustomerLogin'; // Updated import
import CustomerPayment from './pages/CustomerPayment';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<CustomerPayment />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;