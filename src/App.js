import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Channel from './pages/Channels';
import AddNewChannel from './pages/AddNewChannel';
import FeedNewsPage from './pages/FeedNewsPage';
import Menu from './components/MenuBox/MenuBox'; 
import './index.css';

const App = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="main_container">
      <Menu onNavigate={handleNavigation} /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/channels" element={<Channel />} />
        <Route path="/add-new-channel" element={<AddNewChannel />} />
        <Route path="/feed-news/:feedId" element={<FeedNewsPage />} />
      </Routes>
    </div>
  );
};

const RootApp = () => (
  <Router>
    <App />
  </Router>
);

export default RootApp;
