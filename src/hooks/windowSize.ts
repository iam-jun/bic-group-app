import {Dimensions} from 'react-native';

import {useEffect, useState} from 'react';

export interface windowProps {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

export default function useWindowDimensions() {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) =>
      handleChange(window),
    );
    const newWindow = Dimensions.get('window');
    handleChange(newWindow);
    return () => {
      subscription.remove();
    };
  }, [dimensions]);

  const handleChange = (window: windowProps) => {
    if (
      dimensions.width !== window.width ||
      dimensions.height !== window.height ||
      dimensions.scale !== window.scale ||
      dimensions.fontScale !== window.fontScale
    ) {
      setDimensions(window);
    }
  };

  return dimensions;
}
