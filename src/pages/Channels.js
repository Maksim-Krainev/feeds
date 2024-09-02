import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Menu from '../components/MenuBox/MenuBox';
import "../index.css";

const Channel = () => {
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);
  const [selectionError, setSelectionError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('https://google-news-observer-3.hype.dev/api/kernel/list', {
          headers: {
            'Authorization': 'Basic S2V5Ym9hcmRBcm15Om1hbnVzY3JpcHRfaW5fdGhlX3Bhc3QxNTY=',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server');
        }

        const data = JSON.parse(text);

        const apiChannels = data.map((kernel) => ({
          _id: kernel._id,
          channelName: `Feed ID: ${kernel._id}`,
          updateDate: kernel.date,
          keywords: [], 
        }));

        setChannels(apiChannels);

        const channelsWithKeywords = [];

        for (const channel of apiChannels) {
          try {
            const keysResponse = await fetch(`https://google-news-observer-3.hype.dev/api/key/list?kernelIdentifier=${encodeURIComponent(channel._id)}`, {
              headers: {
                'Authorization': 'Basic S2V5Ym9hcmRBcm15Om1hbnVzY3JpcHRfaW5fdGhlX3Bhc3QxNTY=',
              },
            });

            if (!keysResponse.ok) {
              throw new Error(`HTTP error! status: ${keysResponse.status}`);
            }

            const keysText = await keysResponse.text();
            const keysData = keysText ? JSON.parse(keysText) : [];
            
            const keywords = Array.isArray(keysData) ? keysData.map(key => key.text) : [];

            if (keywords.length > 0) {
              channelsWithKeywords.push({
                ...channel,
                keywords,
              });
            }
          } catch (error) {
            console.error(`Error fetching keywords for channel ID ${channel._id}:`, error);
          }
        }

        setChannels(channelsWithKeywords);
      } catch (error) {
        console.error('Error fetching channels:', error);
        setError('An error occurred while fetching channels.');
      }
    };

    fetchChannels();
  }, []);

  const handleEditClick = (selectedChannelId) => {
    const selectedChannelData = channels.find(channel => channel._id === selectedChannelId);

    if (!selectedChannelData) {
      setSelectionError('Channel not found.');
      return;
    }

    const { _id: channelId, keywords } = selectedChannelData;
    navigate(`/edit-channel/${channelId}`, { state: { channelId, keywords } });
  };

  return (
    <div>
      <Menu />
      <div className='container_box gray_bg'>
        <div className="channels_conf_buts">
          <h1>List of your feeds</h1>
          <Link to='/add-new-channel' className="channel_add_but" >New feed</Link>
        </div>
        {selectionError && (
          <div className="error_message">{selectionError}</div>
        )}
      </div>
      {error ? (
        <div className="error_message">{error}</div>
      ) : (
        channels.map((channel, index) => (
          <div 
            key={channel._id}
            className={`container_box ${index % 2 === 0 ? 'light' : 'dark'}`}
          >
            <Link 
              to={`/feed-news/${channel._id}`}
              className="channel_info_cont"
              style={{ textDecoration: 'none', color: "#000" }} 
            >
              <div className="channel_box">
                <div className="channel_tit_box">
                  <div className="channel_title">
                    {channel.channelName}
                  </div>
                  <div className="channel_info_box">
                    <div className="channel_update">
                      Updated: {channel.updateDate ? new Date(channel.updateDate).toLocaleDateString('uk-UA', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }) : 'No date available'}
                    </div>
                  </div>
                  {channel.keywords.length > 0 && (
                    <div className="channel_keywords">
                      <div className="channel_keywords_label">Tags:</div>
                      {channel.keywords.map((keyword, index) => (
                        <div key={index} className="chan_keyword">#{keyword}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
            <button 
              className="channel_edit_button" 
              onClick={() => handleEditClick(channel._id)}
            >
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Channel;
