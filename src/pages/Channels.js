import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Menu from '../components/MenuBox/MenuBox';
import "../index.css";

const Channel = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
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
          updateDate: '',
          keywords: [],
        }));

        setChannels(apiChannels);

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

            setChannels((prevChannels) =>
              prevChannels.map((c) =>
                c._id === channel._id
                  ? {
                      ...c,
                      keywords: keywords,
                    }
                  : c
              )
            );

            // Fetch events to update the `updateDate`
            fetchChannelEvents(channel._id);
          } catch (error) {
            console.error(`Error fetching keywords for channel ID ${channel._id}:`, error);
          }
        }
      } catch (error) {
        console.error('Error fetching channels:', error);
        setError('An error occurred while fetching channels.');
      }
    };

    const fetchChannelEvents = async (channelId) => {
      try {
        const response = await fetch(`https://google-news-observer-3.hype.dev/api/event/list?kernelIdentifier=${encodeURIComponent(channelId)}`);
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const eventsText = await response.text();
        const eventsData = eventsText ? JSON.parse(eventsText) : [];
    
        if (eventsData.length > 0) {
          const firstEvent = eventsData[0];
          const eventDate = new Date(firstEvent.date);
    
          // Formatted to dd.mm.yy.
          const formattedDate = eventDate.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
    
          setChannels((prevChannels) =>
            prevChannels.map((channel) =>
              channel._id === channelId
                ? { ...channel, updateDate: formattedDate }
                : channel
            )
          );
        }
      } catch (error) {
        console.error(`Error fetching events for channel ID ${channelId}:`, error);
      }
    };

    fetchChannels();
  }, []);

  const handleCheckboxChange = (channelId) => {
    setSelectedChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleAddNews = () => {
    if (selectedChannels.length === 0) {
      setSelectionError('Please select at least one channel.');
      return;
    } else if (selectedChannels.length > 1) {
      setSelectionError('You can only select one channel.');
      return;
    }

    setSelectionError('');
    const selectedChannelData = channels.find(channel =>
      selectedChannels.includes(channel._id)
    );

    const channelId = selectedChannelData._id;
    const keywords = selectedChannelData.keywords;

    navigate('/add-new-channel', { state: { channelId, keywords } });
  };

  const handleViewNews = (channelId) => {
    navigate(`/feed-news/${channelId}`);
  };

  return (
    <div>
      <Menu />
      <div className='container_box gray_bg'>
        <div className="channels_conf_buts">
          <Link to='/add-new-channel' className="channel_add_but">New feed</Link>
          <button onClick={handleAddNews} className="channel_add_but">Edit feed</button>
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
            <div className="channel_info_cont">
              <div className="channel_edit">
                <input
                  type="checkbox"
                  checked={selectedChannels.includes(channel._id)}
                  onChange={() => handleCheckboxChange(channel._id)}
                />
              </div>
              <div className="channel_box">
                <div className="channel_tit_box">
                  <div
                    className="channel_title"
                    onClick={() => handleViewNews(channel._id)} 
                    style={{ cursor: 'pointer' }} 
                  >
                    {channel.channelName}
                  </div>
                  <div className="channel_info_box">
                    <div className="channel_update">
                      Updated: {channel.updateDate ? channel.updateDate : 'No date available'}
                    </div>
                  </div>
                  <div className="channel_keywords">
                    <div className="channel_keywords_label">Tags:</div>
                    {channel.keywords.length > 0 ? (
                      channel.keywords.map((keyword, index) => (
                        <div key={index} className="chan_keyword">#{keyword}</div>
                      ))
                    ) : (
                      <div className="no_keywords">No keywords</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Channel;
