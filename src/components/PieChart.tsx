import React from 'react';

interface PieChartProps {
  onSectorClick: (index: number) => void;
  selectedIndex: number;
}

export const PieChart: React.FC<PieChartProps> = ({ onSectorClick, selectedIndex }) => {
  const segments = [
    { 
      color: '#DC2626', 
      startAngle: 0, 
      endAngle: 36, 
      name: 'Survival Chinese',
      shortName: 'Survival\nChinese'
    },
    { 
      color: '#3498DB', 
      startAngle: 36, 
      endAngle: 72, 
      name: 'Parent-Kid Chinese',
      shortName: 'Parent-Kid\nChinese'
    },
    { 
      color: '#2ECC71', 
      startAngle: 72, 
      endAngle: 108, 
      name: 'Business Chinese',
      shortName: 'Business\nChinese'
    },
    { 
      color: '#F39C12', 
      startAngle: 108, 
      endAngle: 144, 
      name: 'Homework Tutoring Chinese',
      shortName: 'Homework\nTutoring'
    },
    { 
      color: '#9B59B6', 
      startAngle: 144, 
      endAngle: 180, 
      name: 'Academic  Chinese',
      shortName: 'Academic\nChinese'
    },
    { color: 'transparent', startAngle: 180, endAngle: 216, name: '', shortName: '' },
    { color: 'transparent', startAngle: 216, endAngle: 252, name: '', shortName: '' },
    { color: 'transparent', startAngle: 252, endAngle: 288, name: '', shortName: '' },
    { color: 'transparent', startAngle: 288, endAngle: 324, name: '', shortName: '' },
    { color: 'transparent', startAngle: 324, endAngle: 360, name: '', shortName: '' },
  ];

  const createPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const getTextPosition = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = radius * 0.65; // Position text at 65% of radius
    return polarToCartesian(centerX, centerY, textRadius, midAngle);
  };

  const handleSectorClick = (index: number) => {
    if (segments[index].color !== 'transparent') {
      onSectorClick(index);
    }
  };

  return (
    <div className="relative">
      <svg width="800" height="800" className="transform transition-transform duration-300">
        {/* Crosshatch pattern definition */}
        <defs>
          <pattern id="crosshatch" patternUnits="userSpaceOnUse" width="8" height="8">
            <rect width="8" height="8" fill="transparent" />
            <path d="M0,8 L8,0" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
            <path d="M0,0 L8,8" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
          </pattern>
          
          {/* Glow filter for selected sector */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Pie segments */}
        {segments.map((segment, index) => {
          const isSelected = index === selectedIndex;
          const isClickable = segment.color !== 'transparent';
          
          return (
            <g key={index}>
              <path
                d={createPath(400, 400, 320, segment.startAngle, segment.endAngle)}
                fill={segment.color}
                className={`transition-all duration-300 ${
                  isClickable 
                    ? 'cursor-pointer hover:brightness-110' 
                    : ''
                }`}
                style={{
                  filter: isSelected ? 'url(#glow) brightness(1.2)' : 'none',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: '400px 400px',
                  opacity: isSelected ? 1 : (isClickable ? 0.9 : 1)
                }}
                onClick={() => handleSectorClick(index)}
              />
              {segment.color !== 'transparent' && (
                <path
                  d={createPath(400, 400, 320, segment.startAngle, segment.endAngle)}
                  fill="url(#crosshatch)"
                  className="pointer-events-none"
                  style={{
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: '400px 400px'
                  }}
                />
              )}
              
              {/* Selection ring for active sector */}
              {isSelected && segment.color !== 'transparent' && (
                <path
                  d={createPath(400, 400, 330, segment.startAngle, segment.endAngle)}
                  fill="none"
                  stroke="white"
                  strokeWidth="6"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}
        
        {/* White separators */}
        {segments.map((segment, index) => {
          const start = polarToCartesian(400, 400, 320, segment.startAngle);
          return (
            <line
              key={`separator-${index}`}
              x1="400"
              y1="400"
              x2={start.x}
              y2={start.y}
              stroke="white"
              strokeWidth="8"
            />
          );
        })}

        {/* Course names */}
        {segments.map((segment, index) => {
          if (segment.color === 'transparent' || !segment.name) return null;
          
          const textPos = getTextPosition(400, 400, 320, segment.startAngle, segment.endAngle);
          const lines = segment.shortName.split('\n');
          const isSelected = index === selectedIndex;
          
          return (
            <g key={`text-${index}`}>
              {lines.map((line, lineIndex) => (
                <text
                  key={lineIndex}
                  x={textPos.x}
                  y={textPos.y + (lineIndex - (lines.length - 1) / 2) * 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={isSelected ? "18" : "16"}
                  fontWeight={isSelected ? "700" : "600"}
                  fontFamily="Montserrat, sans-serif"
                  className="pointer-events-none drop-shadow-lg transition-all duration-300"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: `${textPos.x}px ${textPos.y}px`
                  }}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};