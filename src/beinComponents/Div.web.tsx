import React from 'react';
import {createElement} from 'react-native-web';

export interface Props {
  className?: string;
  onHover?: (event: any) => void;
  [x: string]: any;
}

const Div: React.FC<Props> = ({className, onHover, ...props}: Props) => {
  const createDiv = () => {
    const attrs = {
      className,
      onmouseenter: (e: any) => {
        console.log('onMouseEnter', e);
        onHover && onHover(e);
      },
      ...props,
    };

    return createElement('div', attrs);
  };

  return createDiv();
};

export default Div;
