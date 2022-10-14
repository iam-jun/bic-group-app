import React from 'react';
import {
  StyleProp, Text, TextStyle, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';

import { IMarkdownAudience } from '~/interfaces/IPost';

import { fontFamilies } from '~/theme/fonts';
import useMentionInputStore from '../inputs/MentionInput/store';
import IMentionInputState from '../inputs/MentionInput/store/Interface';
import { useKeySelector } from '~/hooks/selector';

interface Props {
  mentions?: any[];
  mentionName: string;
  style?: StyleProp<TextStyle>;
  onPress?: (audience: IMarkdownAudience, e: any) => void;
}

const AtMention = ({
  mentionName,mentions, style, onPress,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  let audience = mentions?.[mentionName];
  
  const tempSelectedUser = useMentionInputStore(
    (state: IMentionInputState) => state.tempSelected?.[mentionName]
  )

  if (!audience) {
    audience = tempSelectedUser || {};
  }
  const name = audience?.fullname || audience?.data?.fullname;
  const withAudience = !isEmpty(audience);

  const _onPress = (e: any) => {
    onPress?.(audience, e);
  };

  return (
    <Text
      testID="text_mention"
      style={withAudience ? style : styles.baseStyle}
      onPress={withAudience ? _onPress : undefined}
    >
      {`@${
        name || mentionName
      }`}
    </Text>
  );
};

export default AtMention;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    baseStyle: {
      color: colors.neutral80,
      fontFamily: fontFamilies.BeVietnamProLight,
    },
  });
};
