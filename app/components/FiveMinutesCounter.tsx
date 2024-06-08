'use client'
import React, { useState, useEffect } from 'react';

const FiveMinutesCounter = () => {
  const [counter, setCounter] = useState(300); // 300 seconds = 5 minutes

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000); // Update every second

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run effect only once on mount

  const formatTime = (seconds:any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      <h1>Five Minutes Counter</h1>
      <p>Time remaining: {formatTime(counter)}</p>
    </div>
  );
};

export default FiveMinutesCounter;
