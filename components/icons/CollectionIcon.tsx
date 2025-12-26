
import React from 'react';

interface IconProps {
  className: string;
  // FIX: Added style property to allow dynamic styling.
  style?: React.CSSProperties;
}

const CollectionIcon: React.FC<IconProps> = ({ className, style }) => (
  // FIX: Apply the style prop to the SVG element.
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

export default CollectionIcon;
