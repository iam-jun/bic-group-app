import React, {FC} from 'react';
import {View, StyleProp, ViewStyle, TextStyle} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';

export interface TextBadgeProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  value: string;
  backgroundColor?: string;
  textColor?: string;
  variant?: 'green' | 'blue';
  useI18n?: boolean;
}

const TextBadge: FC<TextBadgeProps> = ({
  style,
  textStyle,
  value,
  backgroundColor,
  textColor,
  variant,
  useI18n = true,
}: TextBadgeProps) => {
  const theme = useTheme() as ExtendedTheme;
  const {colors} = theme;

  if (!value) {
    return null;
  }

  let _textColor = colors.blue50;
  let _backgroundColor = colors.green20;
  if (variant === 'blue') {
    _textColor = colors.blue50;
    _backgroundColor = colors.blue20;
  }

  const containerStyle = {
    backgroundColor: backgroundColor || _backgroundColor,
    padding: spacing.padding.tiny,
    borderRadius: spacing.borderRadius.small,
    marginHorizontal: spacing.margin.tiny,
  };

  const _textStyle = {
    color: textColor || _textColor,
  };

  return (
    <View style={[containerStyle, style]} testID="text_badge">
      <Text.BodySMedium useI18n={useI18n} style={[_textStyle, textStyle]}>
        {value}
      </Text.BodySMedium>
    </View>
  );
};

export default TextBadge;
