import React, { useState, useEffect } from 'react';
import Menu from '../components/MenuBox/MenuBox';
import { Link, useNavigate } from 'react-router-dom';
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

        const kernels = data;
        const apiChannels = kernels.map((kernel) => ({
          _id: kernel._id,
          channelName: `Feed ID: ${kernel._id}`,
          updateDate: new Date(kernel.date).toLocaleDateString(),
          events: 'Loading...',
          newEvents: 'Loading...',
          keywords: [],
        }));

        setChannels(apiChannels);

        for (const channel of apiChannels) {
          try {
            const eventsResponse = await fetch(`https://google-news-observer-3.hype.dev/api/kernel/events?kernelIdentifier=${encodeURIComponent(channel._id)}`, {
              headers: {
                'Authorization': 'Basic S2V5Ym9hcmRBcm15Om1hbnVzY3JpcHRfaW5fdGhlX3Bhc3QxNTY=',
              },
            });

            if (!eventsResponse.ok) {
              throw new Error(`HTTP error! status: ${eventsResponse.status}`);
            }

            const eventsText = await eventsResponse.text();
            const eventsData = eventsText ? JSON.parse(eventsText) : [];

            if (!Array.isArray(eventsData)) {
              console.error(`Events data is not an array for channel ID ${channel._id}`);
              continue;
            }

            const eventCount = eventsData.length;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const newEventsCount = eventsData.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate >= today;
            }).length;

            setChannels((prevChannels) =>
              prevChannels.map((c) =>
                c._id === channel._id
                  ? {
                      ...c,
                      events: eventCount,
                      newEvents: newEventsCount,
                    }
                  : c
              )
            );

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
          } catch (error) {
            console.error(`Error fetching data for channel ID ${channel._id}:`, error);
          }
        }
      } catch (error) {
        console.error('Error fetching channels:', error);
        if (error.message.includes('status: 504')) {
          setError('504 Gateway Timeout');
        } else {
          setError('An error occurred while fetching channels.');
        }
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
      <div className='container_box'>
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
            className={`container_box ${index % 2 === 0 ? 'dark' : 'light'}`}
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
                  <div className="channel_title">{channel.channelName}</div>
                  <div className="channel_info_box">
                    <div className="channel_update">Updated: {channel.updateDate}</div>
                    <div className="channel_events">Events: {channel.events}
                      <div className="new_event">+{channel.newEvents}</div>
                    </div>
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
                <button onClick={() => handleViewNews(channel._id)} className="channel_view_news_but">View News</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Channel;
