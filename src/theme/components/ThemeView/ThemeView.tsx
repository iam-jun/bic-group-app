import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';

export interface Props {
  style?: any;
  color?: string;
  children?: any;
}

const ThemeView: React.FC<Props> = ({
  style,
  color = 'background',
  children,
  ...props
}) => {
  const theme: any = useTheme();
  const backgroundColor = theme.colors[color];

  return (
    <View {...props} style={[style, {backgroundColor}]}>
      {children}
    </View>
  );
};

export default ThemeView;
