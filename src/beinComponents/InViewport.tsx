'use strict';
import React, {useEffect, useRef, useState} from 'react';
import {View, Dimensions, ViewProps as RNViewProps} from 'react-native';

const {height: screenHeight, width: screenWidth} = Dimensions.get('window');

interface InViewportProps extends RNViewProps {
  onChange: (isVisible: boolean) => void;
}

const InViewport: React.FC<InViewportProps> = ({
  onChange,
  ...props
}: InViewportProps) => {
  const [state, setState] = useState({
    rectTop: 0,
    rectBottom: 0,
    rectWidth: 0,
  });
  const viewRef = useRef(null);
  const [lastValue, setLastValue] = useState<boolean>(false);
  let interval: any = null;

  useEffect(() => {
    setLastValue(false);
    startWatching();
    isInViewPort();
    return stopWatching;
  }, [state.rectTop, state.rectBottom, state.rectWidth]);

  const startWatching = () => {
    if (interval) {
      return;
    }

    interval = setInterval(() => {
      if (!viewRef || !viewRef.current) {
        return;
      }

      viewRef.current?.measure(
        async (
          _x: number,
          _y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number,
        ) => {
          setState({
            rectTop: pageY,
            rectBottom: pageY + height,
            rectWidth: pageX + width,
          });
        },
      );
    }, 1000);
  };

  const stopWatching = () => {
    interval = clearInterval(interval);
  };

  const isInViewPort = () => {
    const isVisible =
      state.rectBottom != 0 &&
      state.rectTop >= 0 &&
      state.rectBottom <= screenHeight &&
      state.rectWidth > 0 &&
      state.rectWidth <= screenWidth;
    if (lastValue !== isVisible) {
      setLastValue(isVisible);
      onChange(isVisible);
    }
  };

  return (
    <View collapsable={false} ref={viewRef} {...props}>
      {props.children}
    </View>
  );
};

export default InViewport;
