import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Menu from '../components/MenuBox/MenuBox';

const FeedNewsPage = () => {
  const { feedId } = useParams(); // Get feedId from route parameters
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`https://google-news-observer-3.hype.dev/api/event/list?kernelIdentifier=${feedId}`, {
          headers: {
            'Authorization': 'Basic S2V5Ym9hcmRBcm15Om1hbnVzY3JpcHRfaW5fdGhlX3Bhc3QxNTY=',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const newsItems = data.map(event => ({
          id: event._id,
          date: event.date,
          text: event.text,
          url: event.uri,
        }));

        setNews(newsItems);
      } catch (error) {
        setError('Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [feedId]);

  return (
    <div className="main_container">
      <Menu />
      <div className="container_box">
        <h1>News for Feed ID: {feedId}</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error_message">{error}</div>
        ) : news.length > 0 ? (
          news.map((item, index) => (
            <div
              key={item.id}
              className={`news_item ${index % 2 === 0 ? 'light' : 'dark'}`}
              style={{
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#2f2f2f',
                color: index % 2 === 0 ? '#000000' : '#ffffff',
                padding: '15px',
                margin: '10px 0',
                borderRadius: '5px',
              }}
            >
              <div className="news_date">{new Date(item.date).toLocaleDateString()}</div>
              <div className="news_text">{item.text}</div>
              <a href={item.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </div>
          ))
        ) : (
          <div>No news found</div>
        )}
      </div>
    </div>
  );
};

export default FeedNewsPage;
