import Menu from '../components/MenuBox/MenuBox';
import { Link } from 'react-router-dom';
import heroPic from "../img/hero-pic.webp"
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="form-container">
        <Menu />
        <div className='home-conteiner'>
          <div className='left-conteiner'>
            <h2>Hype Feeds Overview</h2>
            <p>The global news landscape is constantly evolving, with stories emerging from every corner of the world. To navigate this dynamic environment, we’ve developed a project that gathers and curates news from across the globe, presenting it through an intuitive feed. This project not only captures mainstream headlines but also digs deep into the topics that are on the verge of becoming the next big thing. With a focus on identifying and tracking emerging trends, the platform ensures that users can stay ahead of the curve by accessing the most relevant and timely information.</p>
            <p>The feed is built around a robust semantic kernel, which powers the platform's ability to filter and organize content effectively. The semantic kernel enables precise categorization of topics, allowing users to seamlessly explore.</p>
            <Link to='/feeds' className="channel_add_but" >Your feeds</Link>
          </div>
          <div className='right-conteiner'>
            <img src={heroPic} alt='Hero pictures' />
            <h2>Stay Ahead of the Curve</h2>
            <p>The <strong>Hype Feeds</strong> is your gateway to understanding and capitalizing on emerging trends before they hit the mainstream. In today’s fast-paced world, hype starts as a whisper in niche communities and gradually builds into a societal phenomenon. By the time the hype reaches its peak, it’s already shaping industries and influencing decisions. However, once it fades from public consciousness, it often continues to thrive within specialized sectors where it finds true adoption and value.</p>
            <p>Our platform empowers you to track these trends from their inception. With the Hype Feeds, you can secure your own piece of the hype before your competitors even know it exists. The process is simple yet powerful:</p>
            <ol>
              <li>
                <p>
                  <strong>Create a Data Kernel:</strong>
                   Start by setting up a data kernel—an identifiable dataset that will serve as the foundation for tracking a specific trend.
                </p>
              </li>
              <li>
                <p>
                  <strong>Define Keywords:</strong>
                  Carefully select the keywords that will guide the data assembly process. Start small to maintain manageable data flow, and gradually expand your keyword list as you refine your focus.
                </p>
              </li>
              <li>
                <p>
                  <strong>Assemble Data:</strong>
                  Allow the system to gather the information associated with your chosen keywords. This step requires patience as the assembling agent works to collect the most relevant data.
                </p>
              </li>
              <li>
                <p>
                  <strong>Explore the Hype:</strong>
                  Once the data is compiled, it’s ready for exploration. Use these insights to enhance your business strategies and stay one step ahead of the competition.
                </p>
              </li>
            </ol>
            <p>While our platform offers OpenSource access to monitor popular trends, observing custom hype topics incurs additional server resource costs, making it a paid service. Nevertheless, the investment is well worth it for those who recognize the value of early trend detection in driving business success.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
