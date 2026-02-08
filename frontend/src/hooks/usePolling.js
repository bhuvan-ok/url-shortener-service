import { useEffect, useRef } from 'react';

export const usePolling = (callback, interval = 3000, enabled = true) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval, enabled]);
};

export const useVisibilityChange = (callback) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        callback();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback]);
};