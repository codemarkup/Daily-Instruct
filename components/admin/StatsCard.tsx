'use client';

import React from 'react';
import '../../styles/admin/components.css';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
  trend: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color,
  trend 
}) => {

  const isSvg = icon?.endsWith('.svg');
  return (
    <div className={`stats-card ${color}`}>
      <div className="stats-card-header">
        <div className="stats-icon">
          {isSvg ? (
            <img 
              src={icon} 
              alt={title} 
              className="stats-svg-icon"
              width={24}
              height={24}
            />
          ) : (
            <span>{icon}</span>
          )}
        </div>
        <div className={`trend-indicator ${trend}`}>
          {trend === 'up' ? '↗' : '↘'} {change}
        </div>
      </div>
      <div className="stats-card-content">
        <h3 className="stats-value">{value}</h3>
        <p className="stats-title">{title}</p>
      </div>
      <div className="stats-card-progress">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;