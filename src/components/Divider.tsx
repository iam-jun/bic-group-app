import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';

export interface Props {
  type?: string;
  space?: number;
  color?: string;
  thick?: number;
  [x: string]: any;
}

const Divider: React.FC<Props> = ({type, space, color, thick, ...props}) => {
  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  return (
    <View
      style={[
        type === 'horizontal'
          ? {...styles.horizontal, marginVertical: space, height: thick}
          : {...styles.vertical, marginHorizontal: space, width: thick},
        {backgroundColor: color || colors.divider},
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});

Divider.defaultProps = {
  type: 'horizontal',
  space: 0,
  thick: 0.5,
};

export default Divider;
