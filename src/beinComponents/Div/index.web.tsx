import React from 'react';
import {createElement} from 'react-native-web';

export interface Props {
  className?: string;
  [x: string]: any;
}

const Div: React.FC<Props> = ({className, ...props}: Props) => {
  const createDiv = () => {
    const attrs = {
      className,

      ...props,
    };

    return createElement('div', attrs);
  };

  return createDiv();
};

export default Div;
