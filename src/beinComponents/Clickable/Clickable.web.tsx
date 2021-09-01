import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {createElement} from 'react-native-web';

export interface Props {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  onRightClick: (x: number, y: number) => void;
}

const Clickable: React.FC<Props> = ({style, children, onRightClick}: Props) => {
  const _onRightClick = e => {
    onRightClick(e.pageX, e.pageY);
  };

  const createDiv = () => {
    const attrs = {
      style: style,
      onContextMenu: e => {
        e.preventDefault();
        _onRightClick(e);
      },
      children,
    };

    return createElement('div', attrs);
  };

  return createDiv();
};

export default Clickable;
