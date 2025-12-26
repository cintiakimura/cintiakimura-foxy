
import React, { useEffect, useState } from 'react';

interface SparkleOverlayProps {
  onComplete: () => void;
}

const Sparkle: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  return <div className="sparkle" style={style}>✨</div>;
};

const SparkleOverlay: React.FC<SparkleOverlayProps> = ({ onComplete }) => {
  const [sparkles, setSparkles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: 20 }).map((_, i) => {
      const style = {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 0.5}s`,
      };
      return <Sparkle key={i} style={style} />;
    });
    setSparkles(newSparkles);

    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {sparkles}
    </div>
  );
};

export default SparkleOverlay;
