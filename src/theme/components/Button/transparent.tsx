import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native';
import Text from '../Text';
import Icon from '../Icon';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';
import icons from '~/constants/icons';
import {spacing} from '~/theme/configs';

export interface Props {
  text?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  hasRightIcon?: boolean;
  [x: string]: any;
}

const TransparentButton: React.FC<Props> = ({
  text,
  style,
  textStyle,
  onPress,
  hasRightIcon,
  ...restProps
}) => {
  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  return (
    <TouchableOpacity onPress={onPress} {...restProps}>
      <View style={[styles.container, style]}>
        <Text style={[styles.text, textStyle, {color: colors.primary}]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

TransparentButton.defaultProps = {
  activeOpacity: 0.8,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginEnd: spacing.margin.small,
  },
});

export default TransparentButton;
