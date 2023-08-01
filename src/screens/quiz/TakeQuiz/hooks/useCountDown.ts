import { useState, useEffect, useRef } from 'react';
import { getTimeValues } from './helper';

const useCountdown = (
  startedAt: string,
  timeLimit: number,
) => {
  const startedAtDate = new Date(startedAt).getTime();
  const endedAtDate = new Date(startedAtDate + timeLimit * 1000).getTime();
  const timer = useRef(null);

  const [countDown, setCountDown] = useState(
    endedAtDate - new Date().getTime(),
  );

  useEffect(() => {
    timer.current = setInterval(() => {
      setCountDown(endedAtDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(timer.current);
  }, [endedAtDate]);

  return {
    timer,
    ...getTimeValues(countDown),
  };
};

export default useCountdown;
