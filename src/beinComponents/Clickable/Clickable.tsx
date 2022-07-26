import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

export interface Props {
  onRightClick?: (x: number, y: number) => void;
}

const Clickable: React.FC<Props> = ({ onRightClick, ...props }: Props) => (
  <TouchableWithoutFeedback
    {...props}
    onLongPress={() => onRightClick?.(-1, -1)}
  />
);

export default Clickable;
