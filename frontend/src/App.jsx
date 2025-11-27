import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from './components/contexts/AuthContext';
import './App.css';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Home from './components/shared/Home';
import Signup from './components/shared/Signup';
import ReportDetails from './components/shared/ReportDetails';
import Dashboard from './components/shared/Dashboard';
import PermissionPage from './components/Services/Permissions';
import Feedback from './components/Services/Feedback';
import ContactUs from './components/shared/ContactUs';
import ApplyLicenseForm from './components/Services/E-license';
import DeathForm from './components/Services/DeathCertificate';
import BirthRegistrationForm from './components/Services/BirthCertificate';
import EventPermissionForm from './components/Services/Event';
import PetRegistrationForm from './components/Services/PerPerms';
import SwachhataActivityForm from './components/Services/Swatch';
import NotFound from './components/shared/Notfound';
import PermissionRequestForm from './components/Services/Startup';
import WaterConnectionForm from './components/Services/WaterConn';
import AddEngineerForm from './components/Services/C&D';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/permissions" element={<PermissionPage />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/e-license" element={<ApplyLicenseForm />} />
        <Route path="/death-certificate" element={<DeathForm />} />
        <Route path="/birth-certificate" element={<BirthRegistrationForm />} />
        <Route path="/event-permission" element={<EventPermissionForm />} />
        <Route path="/pet-permission" element={<PetRegistrationForm />} />
        <Route path="/swach-bhart" element={<SwachhataActivityForm />} />
        <Route path="/startup" element={<PermissionRequestForm />} />
        <Route path="/water-connection" element={<WaterConnectionForm />} />
        <Route path="/c-and-d" element={<AddEngineerForm />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
