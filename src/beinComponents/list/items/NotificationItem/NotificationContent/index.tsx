import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IGetStreamNotificationActivity } from '~/interfaces/INotification';

import Text from '~/beinComponents/Text';
import MarkdownView from '~/beinComponents/MarkdownView';

interface Props {
  activities: IGetStreamNotificationActivity[];
  description: string;
  verb: string;
  actorCount: number;
  defaultContent?: string;
}

// this function is used to determine type of each notification
// then render them with defference content corresponding their type
const NotificationContent = ({
  description,
  activities,
  verb,
  actorCount,
  defaultContent,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const getContent = () => {
    switch (verb) {
      case 'COMMENT':
        if (actorCount > 1) {
          return false;
        }
        return (
          activities[0]?.comment?.child?.content
          || activities[0]?.comment?.content
          || ''
        );
      case 'POST':
      case 'CHANGE':
        return defaultContent;
      case 'REACT':
        if (actorCount === 1) {
          return (
            activities[0]?.comment?.child?.content
            || activities[0]?.comment?.content
            || defaultContent
          );
        }
        return defaultContent;
      default:
        return '';
    }
  };

  const content = getContent();

  return (
    <View testID="notification_content" style={styles.container}>
      <MarkdownView testID="notification_content.description">
        {description}
      </MarkdownView>
      {!!content && (
        <Text.BodyS
          testID="notification_content.content"
          numberOfLines={1}
          style={styles.subContent}
        >
          {content}
        </Text.BodyS>
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
    },
    subContent: {
      color: colors.gray50,
    },
  });
};

export default NotificationContent;
