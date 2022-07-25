import { useEffect, useState } from 'react';
import { useWindowDimensions as useWindow } from 'react-native';

export interface windowProps {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

export default function useWindowDimensions() {
  const {
    height, width, scale, fontScale,
  } = useWindow();
  const [dimensions, setDimensions] = useState<windowProps>({
    height,
    width,
    scale,
    fontScale,
  });

  useEffect(() => {
    setDimensions((s) => ({
      ...s, height, width, scale, fontScale,
    }));
  }, [height, width, scale, fontScale]);

  return dimensions;
}
