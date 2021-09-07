import React from 'react';
import {createElement} from 'react-native-web';

export interface Props {
  className?: string;
  onHover?: (event: any) => void;
  onBlur?: (event: any) => void;
  [x: string]: any;
}

const Div: React.FC<Props> = ({
  className,
  onHover,
  onBlur,
  ...props
}: Props) => {
  const createDiv = () => {
    const attrs = {
      className,
      onMouseOver: (e: any) => onHover && onHover(e),
      onMouseLeave: (e: any) => onBlur && onBlur(e),
      ...props,
    };

    return createElement('div', attrs);
  };

  return createDiv();
};

export default Div;
