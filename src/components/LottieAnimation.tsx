'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationPath: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieAnimation({ 
  animationPath, 
  className = "w-12 h-12",
  loop = true,
  autoplay = true 
}: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch the JSON file
    fetch(animationPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load animation');
        }
        return response.json();
      })
      .then(data => {
        setAnimationData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading animation:', err);
        setError(true);
        setLoading(false);
      });
  }, [animationPath]);

  if (loading) {
    return <div className={`${className} bg-gray-200 rounded-full animate-pulse`} />;
  }

  if (error || !animationData) {
    // Fallback to a simple colored circle if animation fails to load
    return (
      <div className={`${className} bg-oman-green rounded-full opacity-50`} />
    );
  }

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
    </div>
  );
}