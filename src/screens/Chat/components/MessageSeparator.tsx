import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import moment from 'moment';

export interface MessageSeparatorProps {
  style?: StyleProp<ViewStyle>;
  updateAt?: string;
  previousUpdateAt?: string;
}

const MessageSeparator: FC<MessageSeparatorProps> = ({
  style,
  updateAt,
  previousUpdateAt,
}: MessageSeparatorProps) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
  const date = moment(updateAt, formats, true);
  const previousDate = moment(previousUpdateAt, formats, true);

  if (date.day() === previousDate.day()) {
    return null;
  }

  const formatDate = () => {
    return date.calendar(null, {
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      lastWeek: 'MMM DD, yyyy',
      sameElse: 'MMM DD, yyyy',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text color={colors.textSecondary}>{formatDate()}</Text>
      <View style={styles.line} />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.margin.small,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.borderDivider,
      margin: spacing.margin.small,
    },
  });
};

export default MessageSeparator;
