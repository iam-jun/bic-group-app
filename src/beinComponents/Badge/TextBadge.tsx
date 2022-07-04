import React, {FC} from 'react';
import {View, StyleProp, ViewStyle, TextStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';

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
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;

  if (!value) {
    return null;
  }

  let _textColor = colors.badgeActive;
  let _backgroundColor = colors.badgeBackgroundActive;
  if (variant === 'blue') {
    _textColor = colors.badgeInfo;
    _backgroundColor = colors.badgeBackgroundInfo;
  }

  const containerStyle = {
    backgroundColor: backgroundColor || _backgroundColor,
    padding: spacing.padding.tiny,
    borderRadius: spacing.borderRadius.tiny,
    marginHorizontal: spacing.margin.tiny,
  };

  const _textStyle = {
    color: textColor || _textColor,
  };

  return (
    <View style={[containerStyle, style]} testID="text_badge">
      <Text.HeadingSB useI18n={useI18n} style={[_textStyle, textStyle]}>
        {value}
      </Text.HeadingSB>
    </View>
  );
};

export default TextBadge;
