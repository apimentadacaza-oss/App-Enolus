import React from 'react';

export const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 22 12 18.77 5.82 22 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
