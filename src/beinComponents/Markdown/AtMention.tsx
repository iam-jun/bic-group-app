import React from 'react';
import {StyleProp, Text, TextStyle, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import isEmpty from 'lodash/isEmpty';

import {useKeySelector} from '~/hooks/selector';
import {IMarkdownAudience} from '~/interfaces/IPost';
import {ITheme} from '~/theme/interfaces';
import {fontFamilies} from '~/theme/fonts';

interface Props {
  selector: string;
  mentionName: string;
  style?: StyleProp<TextStyle>;
  onPress?: (audience: IMarkdownAudience, e: any) => void;
}

const AtMention = ({mentionName, selector, style, onPress}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  let audience = useKeySelector(`${selector}.${mentionName}`);
  const tempSelectedUser = useKeySelector(
    `mentionInput.tempSelected.${mentionName}`,
  );
  if (!audience) {
    audience = tempSelectedUser || {};
  }

  const name = audience?.data?.fullname;
  const withAudience = !isEmpty(audience);

  const _onPress = (e: any) => {
    onPress?.(audience, e);
  };

  return (
    <Text
      testID="text_mention"
      style={withAudience ? style : styles.baseStyle}
      onPress={withAudience ? _onPress : undefined}>{`@${
      name || mentionName
    }`}</Text>
  );
};

export default AtMention;

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    baseStyle: {
      color: colors.textPrimary,
      fontFamily: fontFamilies.OpenSans,
    },
  });
};
