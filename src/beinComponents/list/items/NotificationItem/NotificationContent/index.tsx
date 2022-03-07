import {StyleSheet, View} from 'react-native';
import React from 'react';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';
import NotificationTitle from './NotificationTitle';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {getNotificationContent} from '../helper';

interface Props {
  activities: IGetStreamNotificationActivity[];
}

// this function is used to determine type of each notification
// then render them with defference content corresponding their type
const NotificationContent = ({activities}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const data = getNotificationContent(activities);

  if (!data) return null;

  const {title, body} = data;

  return (
    <View testID="notification_content" style={styles.container}>
      <NotificationTitle testID="notification_content.title" {...title} />
      {!!body && (
        <Text.BodyS
          testID="notification_content.body"
          style={styles.subContent}>
          {body}
        </Text.BodyS>
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      marginStart: spacing?.margin.base,
      flex: 1,
    },
    subContent: {
      color: colors.textSecondary,
    },
  });
};

export default NotificationContent;
