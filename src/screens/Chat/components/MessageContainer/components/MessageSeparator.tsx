import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import moment from 'moment';
import TimeView from '~/beinComponents/TimeView';

export interface MessageSeparatorProps {
  style?: StyleProp<ViewStyle>;
  time?: string;
  previousTime?: string;
}

const MessageSeparator: FC<MessageSeparatorProps> = ({
  time,
  previousTime,
}: MessageSeparatorProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const formats = [moment.ISO_8601, 'MM/DD/YYYY'];
  const date = moment(time, formats, true);
  const previousDate = moment(previousTime, formats, true);

  if (!time || !previousTime || date.day() === previousDate.day()) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <TimeView time={time} type={'dateTime'} />
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
