import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Channel from './pages/Channels';
import AddNewChannel from './pages/AddNewChannel';
import FeedNewsPage from './pages/FeedNewsPage';
import EditChannel from './pages/EditChannel'; 
import Menu from './components/MenuBox/MenuBox';
import ScrollToTop from './components/ScrollTop/ScrollTop'; 
import './styles/style.css';

const App = () => {
  return (
    <div className="main_container">
      <Menu />
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feeds" element={<Channel />} />
        <Route path="/add-new-channel" element={<AddNewChannel />} />
        <Route path="/feed-news/:feedId" element={<FeedNewsPage />} />
        <Route path="/edit-channel/:channelId" element={<EditChannel />} />
        <Route path="*" element={<Navigate to="/" />} />
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
