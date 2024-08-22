import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Channel from './pages/Channels';
import AddNewChannel from './pages/AddNewChannel';
import FeedNewsPage from './pages/FeedNewsPage';
import './index.css';

const App = () => {
  return (
    <Router>
      <div className="main_container">
        <Routes>
          <Route path="/channels" element={<Channel />} />
          <Route path="/" element={<Home />} />
          <Route path="/add-new-channel" element={<AddNewChannel />} />
          <Route path="/feed-news/:feedId" element={<FeedNewsPage />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
