import React from 'react';

const GlobeAltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.52 9.512c.346-.22.716-.41 1.1-.57M20.48 9.512c-.346-.22-.716-.41-1.1-.57M12 3.75a8.25 8.25 0 00-8.25 8.25c0 .99.168 1.942.48 2.82M12 3.75a8.25 8.25 0 018.25 8.25c0 .99-.168 1.942-.48 2.82M4.08 14.49c.346.22.716.41 1.1.57M19.92 14.49c-.346.22-.716.41-1.1.57" />
  </svg>
);

export default GlobeAltIcon;
