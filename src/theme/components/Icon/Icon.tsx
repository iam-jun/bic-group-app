import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import SvgIcon from './SvgIcon';
import FontIcon from './FontIcon';
// import icons from '@resources/icons';

const iconMode = {
  NORMAL: 'normal',
  BOLD: 'bold',
};

export interface Props {
  style?: any;
  iconStyle?: any;
  icon?: any;
  bold?: any;
  tintColor?: any;
  backgroundColor?: any;
  onPress?: any;
  isButton?: any;
  isLoading?: any;
  disabled?: any;
}

const Icon: React.FC<Props> = ({
  style,
  iconStyle,
  icon,
  bold,
  tintColor,
  backgroundColor,
  onPress,
  isButton,
  isLoading,
  disabled,
  ...props
}) => {
  const theme: any = useTheme();
  const colors = theme.colors;

  if (isLoading) return <ActivityIndicator size="small" color={'grey1'} />;

  // const _icons = icons[bold ? iconMode.BOLD : iconMode.NORMAL];
  // const _icon = _icons[icon];

  // if (!_icon) return null;
  const source = {name: 'close', type: 'MaterialIcons'};
  // const source = {name: 'thumb-up', type: 'MaterialIcons'};

  const IconWrapper = FontIcon;

  tintColor = tintColor
    ? colors[tintColor]
      ? colors[tintColor]
      : tintColor
    : colors.text;

  const Wrapper = onPress ? TouchableOpacity : View;
  const styles = StyleSheet.create(createStyles(colors));
  if (isButton && !tintColor) tintColor = colors.white;

  return (
    <Wrapper
      style={[
        styles.container,
        isButton && styles.button,
        style,
        backgroundColor && {backgroundColor: colors[backgroundColor]},
        disabled && styles.disabled,
      ]}
      onPress={onPress}>
      <IconWrapper
        style={iconStyle}
        tintColor={tintColor}
        isButton={isButton}
        {...props}
        {...source}
      />
    </Wrapper>
  );
};

const createStyles = colors => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: colors.accent,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
});

export default Icon;
