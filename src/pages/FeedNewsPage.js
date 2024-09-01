import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Menu from '../components/MenuBox/MenuBox';
import Loader from '../components/Loader/Loader';

const FeedNewsPage = () => {
  const { feedId } = useParams(); 
  const [news, setNews] = useState([]);
  const [newsToday, setNewsToday] = useState([]);
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

        // Calculate number of news items added today
        const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const todayNews = newsItems.filter(item => item.date.split('T')[0] === today);

        setNews(newsItems);
        setNewsToday(todayNews);
        
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
      <div className="container_box white_bg">
        <h1>News for Feed ID: {feedId}</h1>
        <div className="news_summary">
          <div className="channel_events">
            Total News: {news.length} {news.length === 0 } 
            <div className="new_event">
            {newsToday.length > 0 ? (
              <>
                <h2>News Added Today</h2>
                {newsToday.map((item, index) => (
                  <div
                    key={item.id}
                    className={`container_box ${index % 2 === 0 ? 'gray_bg' : 'white_bg'}`}
                  >
                    <div className="news_date">{new Date(item.date).toLocaleDateString()}</div>
                    <h2 className="news_text">{item.text}</h2>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">Read more</a>
                  </div>
                ))}
              </>
            ) : (
              <p>+0</p>
            )}
          </div>
          </div>
        </div>
      </div>
      
      <div className="news_container">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="error_message">{error}</div>
        ) : (
          news.map((item, index) => (
            <div
              key={item.id}
              className={`container_box ${index % 2 === 0 ? 'gray_bg' : 'white_bg'}`}
            >
              <div className="news_date">{new Date(item.date).toLocaleDateString()}</div>
              <h3 className="news_text">{item.text}</h3>
              <a href={item.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedNewsPage;
