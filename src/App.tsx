import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FinancialRisk from './pages/modules/FinancialRisk';
import TripleOne from './pages/modules/TripleOne';
import Personnel from './pages/modules/Personnel';
import Investment from './pages/modules/Investment';
import Procurement from './pages/modules/Procurement';
import Assets from './pages/modules/Assets';
import Treasury from './pages/modules/Treasury';
import PartyBuilding from './pages/modules/PartyBuilding';
import Comprehensive from './pages/modules/Comprehensive';
import RuleEngine from './pages/RuleEngine';
import Records from './pages/Records';
import Analysis from './pages/Analysis';
import Config from './pages/Config';
import DataManagement from './pages/DataManagement';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="financial" element={<FinancialRisk />} />
          <Route path="triple-one" element={<TripleOne />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="investment" element={<Investment />} />
          <Route path="procurement" element={<Procurement />} />
          <Route path="assets" element={<Assets />} />
          <Route path="treasury" element={<Treasury />} />
          <Route path="party" element={<PartyBuilding />} />
          <Route path="comprehensive" element={<Comprehensive />} />
          <Route path="rules" element={<RuleEngine />} />
          <Route path="records" element={<Records />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="data" element={<DataManagement />} />
          <Route path="config" element={<Config />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
