import React from 'react';
import './Loader.css'; 

const Loader = () => {
  return (
    <div className="loader-container">
      <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" x="0" y="0"
        viewBox="0 0 100 100" width="250" height="250">
        <path fill="#3f3f3f" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
};

export default Loader;
