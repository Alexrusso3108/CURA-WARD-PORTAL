import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Wards from './pages/Wards';
import Patients from './pages/Patients';
import Staff from './pages/Staff';

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
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
