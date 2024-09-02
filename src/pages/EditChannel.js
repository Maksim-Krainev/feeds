import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Menu from '../components/MenuBox/MenuBox';


const EditChannel = () => {
  const [channelName, setChannelName] = useState('Add New Channel');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);
  const [savedTags, setSavedTags] = useState(new Set()); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');


  const location = useLocation();
  const state = location.state || { channelId: '', keywords: [] };

  useEffect(() => {
    if (state.channelId) {
      setChannelName(`FEED ID: ${state.channelId}`);
      setTags(state.keywords || []);
      setSavedTags(new Set(state.keywords || [])); // Initialize savedTags with existing keywords
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


  const handleSaveTags = async () => {
    if (tags.length === 0) {
      setSearchError('No tags to save');
      return;
    }

    // Filter out tags that are already saved
    const newTags = tags.filter(tag => !savedTags.has(tag));
    if (newTags.length === 0) {
      setSearchError('All tags are already saved');
      return;
    }

    setLoading(true);
    setSearchError('');

    try {
      // Use the feedId from state as kernelIdentifier
      const kernelIdentifier = state.channelId;
      const createKeyPromises = newTags.map(tag => {
        const formattedTag = tag.trim().replace(/^#/, '');

        // Convert data to x-www-form-urlencoded format
        const params = new URLSearchParams();
        params.append('kernelIdentifier', kernelIdentifier);
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
            setSavedTags(prev => new Set(prev).add(tag)); // Add the tag to savedTags
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
      setSearchError('Failed to save tags');
      console.error('Error during saving tags:', error);
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
                <h2 className="channel_name" style={{ textAlign: "center" }}>Edit feed</h2>
              <h2 className="channel_name">{channelName}</h2>
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
              <button className="save_tags_button add_key_button" onClick={handleSaveTags}>
                Save 
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
            backgroundColor: index % 2 === 0 ? '#ffffff' : '#9b9b9b',
            color: index % 2 === 0 ? '#000000' : '#ffffff',
          }}
        >
          {box.content}
        </div>
      ))}
    </div>
  );
};

export default EditChannel;
