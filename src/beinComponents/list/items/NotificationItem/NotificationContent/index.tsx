import {StyleSheet, View} from 'react-native';
import React from 'react';
import {IGetStreamNotificationActivity} from '~/interfaces/INotification';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import MarkdownView from '~/beinComponents/MarkdownView';

interface Props {
  activities: IGetStreamNotificationActivity[];
  description: string;
}

// this function is used to determine type of each notification
// then render them with defference content corresponding their type
const NotificationContent = ({description, activities}: Props) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  // const data = getNotificationContent(activities);

  let content = '';
  if (activities?.length > 0) {
    content = activities[0]?.content || '';
  }

  return (
    <View testID="notification_content" style={styles.container}>
      <View style={styles.header}>
        <MarkdownView>{description}</MarkdownView>
      </View>
      {!!content && (
        <Text.BodyS
          testID="notification_content.body"
          numberOfLines={1}
          style={styles.subContent}>
          {content}
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
    header: {
      flexDirection: 'row',
    },
    subContent: {
      color: colors.textSecondary,
    },
  });
};

export default NotificationContent;
