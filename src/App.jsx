import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Wards from './pages/Wards';
import Patients from './pages/Patients';
import Staff from './pages/Staff';
import WardTransfers from './pages/WardTransfers';
import Billing from './pages/Billing';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/wards" element={<Wards />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/transfers" element={<WardTransfers />} />
            <Route path="/billing" element={<Billing />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
