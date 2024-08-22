import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Menu from '../components/MenuBox/MenuBox';
import logo from '../img/logo.png';

const AddNewChannel = () => {
  const [channelName, setChannelName] = useState('Add New Channel');
  const [inputName, setInputName] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || { channelId: '', keywords: [] };

  useEffect(() => {
    if (state.channelId) {
      setChannelName(`FEED ID: ${state.channelId}`);
      setTags(state.keywords || []);
    }
  }, [state.channelId, state.keywords]);

  const handleAddTag = () => {
    if (newTag.trim() === '') {
      setError('Please enter a keyword');
      return;
    }

    const tagArray = newTag.split(/[\s_]+/).filter(tag => tag.trim() !== '');
    setTags([...tags, ...tagArray]);
    setNewTag('');
    setError('');
  };

  const handleTagClick = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (inputName.trim() !== '') {
      setChannelName(inputName);
      setInputName('');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSearch = async () => {
    if (tags.length === 0) {
      setSearchError('No tags to search');
      return;
    }

    setLoading(true);
    setSearchError('');

    try {
      // Step 1: Create Kernel
      const kernelResponse = await fetch('https://google-news-observer-3.hype.dev/api/kernel/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic S2V5Ym9hcmRBcm15Om1hbnVzY3JpcHRfaW5fdGhlX3Bhc3QxNTY='
        },
      });

      const kernelData = await kernelResponse.json();
      const kernelId = kernelData._id;

      console.log('Kernel ID:', kernelId);

      // Step 2: Create Kernel Keys for each tag
      const createKeyPromises = tags.map(tag => {
        const formattedTag = tag.trim().replace(/^#/, '');
        console.log('Creating key for tag:', formattedTag);

        // Convert data to x-www-form-urlencoded format
        const params = new URLSearchParams();
        params.append('kernelIdentifier', kernelId);
        params.append('text', formattedTag);
        params.append('culture', 'en');

        return fetch('https://google-news-observer-3.hype.dev/api/key/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic S2V5Ym9hcmRBcm15Om1hbnVzY3JpcHRfaW5fdGhlX3Bhc3QxNTY='
          },
          body: params.toString()
        })
        .then(response => response.json())
        .then(data => {
          console.log('Key creation response:', data);
          if (data._id) {
            console.log(`Key for tag "${formattedTag}" created successfully:`, data);
          } else {
            console.warn(`Key for tag "${formattedTag}" was not created successfully:`, data);
          }
        })
        .catch(error => {
          console.error('Error creating key for tag:', error);
        });
      });

      await Promise.all(createKeyPromises);
      console.log('All keys created successfully');
    } catch (error) {
      setSearchError('Failed to perform search');
      console.error('Error during search:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main_container">
      <Menu />
      {[
        { className: 'cont_indent', content: <div className="mid_block"></div> },
        { content: (
          <div className="channel_name_block">
            <div className="channel_name_autor">
              <h2 className="channel_name">{channelName}</h2>
            </div>
            <div className="channel_logo_add">
              <img src={logo} alt="channel logo" className="channel_img" />
            </div>
          </div>
        )},
        { content: (
          <div className="edit_contr_buts">
            <button className="edit_contr_save" onClick={handleSave}>Save</button>
            <button className="edit_conts_cancel" onClick={handleCancel}>Cancel</button>
          </div>
        )},
        { content: (
          <div className="add_chan_name">
            <div className="add_chan_title">Name</div>
            <div className="add_chan_write">
              <input
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                type="text"
                placeholder="input"
              />
            </div>
          </div>
        )},
        { content: (
          <div className="add_keywords_cont">
            <div className="keywords_block">
              <div className="keywords_box">
                {tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <div
                      key={index}
                      className="chan_keyword"
                      onClick={() => handleTagClick(tag)}
                    >
                      #{tag}
                    </div>
                  ))
                ) : (
                  <div className="no_keywords">No keywords added</div>
                )}
              </div>
            </div>
            <div className="add_keyword_box">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                type="text"
                placeholder="Add keyword(s)"
                style={{ borderColor: error ? 'red' : '' }}
              />
              <button className="add_key_button" onClick={handleAddTag}>
                <i className="fas fa-plus"></i> Add
              </button>
              <button className="search_button add_key_button" onClick={handleSearch}>
                Search
              </button>
              {error && <div className="error_message">{error}</div>}
              {searchError && <div className="error_message">{searchError}</div>}
              {loading && <div>Loading...</div>}
            </div>
          </div>
        )},
      ].map((box, index) => (
        <div
          key={index}
          className={`container_box ${box.className || ''}`}
          style={{
            backgroundColor: index % 2 === 0 ? '#ffffff' : '#2f2f2f',
            color: index % 2 === 0 ? '#000000' : '#ffffff',
          }}
        >
          {box.content}
        </div>
      ))}
    </div>
  );
};

export default AddNewChannel;
